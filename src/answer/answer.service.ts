import { Injectable } from '@nestjs/common';
import { CreateAnswerDTO } from './dto/create-answer.dto';
import { UpdateAnswerDTO } from './dto/update-answer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Answer } from './answer.schema';
import { Model, Types } from 'mongoose';
import filterData from 'src/utils/functions/filterData.function';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer.name) private readonly answerModel: Model<Answer>,
  ) {}

  async create(createAnswerDto: CreateAnswerDTO) {
    const answer = await this.answerModel.create(createAnswerDto);
    return filterData(answer);
  }

  async find(limit?: number) {
    const answers = await this.answerModel
      .find(null, null, { limit })
      .populate('author', '_id username userType avatarUrl')
      .exec();
    return filterData(answers);
  }

  async findByQuestion(question: string) {
    const answers = await this.answerModel
      .find({ question })
      .populate('author', '_id username type avatarUrl')
      .exec();
    return filterData(answers);
  }

  async findByAuthor(author: string) {
    const answers = await this.answerModel
      .find({ author })
      .populate('question')
      .exec();
    return filterData(answers);
  }

  async findById(id: string) {
    const answers = await this.answerModel
      .findById(id)
      .populate('author', '_id username type avatarUrl')
      .populate('question')
      .exec();
    return filterData(answers);
  }

  async vote(id: string, user: string, down?: boolean) {
    const userId = new Types.ObjectId(user);
    const stored = await this.answerModel.findById(id).exec();

    if (down) {
      if (stored.downvotes.includes(userId)) return false;
      if (stored.upvotes.includes(userId)) await this.unvote(id, user);
      return await this.answerModel
        .findByIdAndUpdate(id, {
          $push: { downvotes: user },
        })
        .exec();
    }

    if (stored.downvotes.includes(userId)) await this.unvote(id, user, true);
    if (stored.upvotes.includes(userId)) return false;
    return await this.answerModel
      .findByIdAndUpdate(id, {
        $push: { upvotes: user },
      })
      .exec();
  }

  async unvote(id: string, user: string, down?: boolean) {
    const answer = await this.answerModel
      .findByIdAndUpdate(id, {
        $pull: down ? { downvotes: user } : { upvotes: user },
      })
      .exec();
    return answer;
  }

  async update(id: string, updateAnswerDTO: UpdateAnswerDTO) {
    const answers = await this.answerModel
      .findByIdAndUpdate(id, updateAnswerDTO, { new: true })
      .exec();
    return filterData(answers);
  }

  async remove(id: string) {
    const answers = await this.answerModel.findByIdAndDelete(id).exec();
    return filterData(answers);
  }
}
