import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { CourseArticle } from './course-article.schema';
import { CreateCourseArticleDTO } from './dto/create.dto';
import { UpdateCourseArticleDTO } from './dto/update.dto';
import { ResponseArticle } from '../../utils/types';
import filterData from '../../utils/functions/filterData.function';

@Injectable()
export class CourseArticleService {
  constructor(
    @InjectModel(CourseArticle.name)
    private readonly courseArticleModel: Model<CourseArticle>,
  ) {}

  async create(data: CreateCourseArticleDTO) {
    const article = await this.courseArticleModel.create(data);
    return this.getArticleData(article);
  }

  async findAll() {
    const articles = await this.courseArticleModel.find().exec();
    return this.getArticleData(articles, ['content']);
  }

  async findBySlug(slug: string) {
    const article = await this.courseArticleModel.findOne({ slug }).exec();
    return this.getArticleData(article);
  }

  async findById(id: string) {
    const article = await this.courseArticleModel.findById(id).exec();
    return this.getArticleData(article);
  }

  async findByCourse(course: string) {
    const articles = await this.courseArticleModel.find({ course }).exec();
    return this.getArticleData(articles, ['content']);
  }

  async findByModule(module: string) {
    const articles = await this.courseArticleModel.find({ module }).exec();
    return this.getArticleData(articles, ['content']);
  }

  async findByNumber(course: string, number: number) {
    const article = await this.courseArticleModel
      .findOne({ course, number })
      .exec();
    return this.getArticleData(article);
  }

  async update(id: string, data: UpdateCourseArticleDTO) {
    const article = await this.courseArticleModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    return this.getArticleData(article);
  }

  async remove(id: string) {
    const article = await this.courseArticleModel.findByIdAndDelete(id).exec();
    return this.getArticleData(article);
  }

  private getArticleData(
    data: Document<unknown, {}, CourseArticle> &
      CourseArticle & { _id: Types.ObjectId } & { __v: number },
    exclude?: (keyof CourseArticle)[],
  ): ResponseArticle<CourseArticle>;
  private getArticleData(
    data: (Document<unknown, {}, CourseArticle> &
      CourseArticle & { _id: Types.ObjectId } & { __v: number })[],
    exclude?: (keyof CourseArticle)[],
  ): ResponseArticle<CourseArticle>[];
  private getArticleData(data: any, exclude?: (keyof CourseArticle)[]): any {
    return filterData(
      data,
      exclude && exclude.length ? ['type', ...exclude] : ['type'],
    );
  }
}
