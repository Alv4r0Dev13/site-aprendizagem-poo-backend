import { Injectable } from '@nestjs/common';
import { CreateQuestionDTO } from './dto/create-question.dto';
import { UpdateQuestionDTO } from './dto/update-question.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './question.schema';
import { Model } from 'mongoose';
import filterData from 'src/utils/functions/filterData.function';
import { LikeQuestionDTO } from './dto/like-question.dto';

const populateAuthorQuery = '_id username userType avatarUrl';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDTO) {
    const question = await this.questionModel.create(createQuestionDto);
    return filterData(question);
  }

  async find(limit?: number) {
    const questions = await this.questionModel
      .find(null, null, { limit })
      .populate('author', populateAuthorQuery)
      .exec();
    return filterData(questions);
  }

  async findByAuthor(author: string) {
    const questions = await this.questionModel.find({ author }).exec();
    return filterData(questions, ['author']);
  }

  async findById(id: string) {
    const questions = await this.questionModel
      .findById(id)
      .populate('author', populateAuthorQuery)
      .exec();
    return filterData(questions);
  }

  async like(id: string, { userId, unlike }: LikeQuestionDTO) {
    const query = unlike
      ? { $pull: { likes: userId } }
      : { $push: { likes: userId } };
    return await this.questionModel.findByIdAndUpdate(id, query).exec();
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDTO) {
    const question = await this.questionModel
      .findByIdAndUpdate(id, updateQuestionDto, { new: true })
      .populate('author', populateAuthorQuery)
      .exec();
    return filterData(question);
  }

  async remove(id: string) {
    const question = await this.questionModel
      .findByIdAndDelete(id)
      .populate('author', populateAuthorQuery)
      .exec();
    return filterData(question);
  }
}
