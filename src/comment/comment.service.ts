import { Injectable } from '@nestjs/common';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './comment.schema';
import { Model } from 'mongoose';
import filterData from 'src/utils/functions/filterData.function';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async create(createCommentDTO: CreateCommentDTO) {
    const comment = await this.commentModel.create(createCommentDTO);
    return filterData(comment);
  }

  async find(limit?: number) {
    const comments = await this.commentModel
      .find(null, null, { limit })
      .populate('author', '_id username')
      .exec();
    return filterData(comments);
  }

  async findByContainer(question: string, answer?: string) {
    const comments = await this.commentModel
      .find({ at: { question, answer } })
      .populate('author', '_id username')
      .exec();
    return filterData(comments);
  }

  async findById(id: string) {
    const comment = await this.commentModel
      .findById(id)
      .populate('author', '_id username')
      .exec();
    return filterData(comment);
  }

  async update(id: string, updateCommentDTO: UpdateCommentDTO) {
    const comment = await this.commentModel
      .findByIdAndUpdate(id, updateCommentDTO, { new: true })
      .exec();
    return filterData(comment);
  }

  async remove(id: string) {
    const comment = await this.commentModel.findByIdAndDelete(id).exec();
    return filterData(comment);
  }
}
