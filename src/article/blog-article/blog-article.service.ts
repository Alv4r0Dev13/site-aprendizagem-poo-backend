import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { BlogArticle } from './blog-article.schema';
import { CreateBlogArticleDTO } from './dto/create.dto';
import { UpdateBlogArticleDTO } from './dto/update.dto';
import { ResponseArticle } from '../../utils/types';
import filterData from '../../utils/functions/filterData.function';

@Injectable()
export class BlogArticleService {
  constructor(
    @InjectModel(BlogArticle.name)
    private readonly blogArticleModel: Model<BlogArticle>,
  ) {}

  async create(data: CreateBlogArticleDTO) {
    const article = await this.blogArticleModel.create(data);
    return this.getArticleData(article);
  }

  async find(title?: string) {
    const query = title ? { title: new RegExp(title, 'gi') } : undefined;
    const articles = await this.blogArticleModel.find(query).exec();
    return this.getArticleData(articles, ['content']);
  }

  async findById(id: string) {
    const article = await this.blogArticleModel.findById(id).exec();
    return this.getArticleData(article);
  }

  async findBySlug(slug: string) {
    const article = await this.blogArticleModel.findOne({ slug }).exec();
    return this.getArticleData(article);
  }

  async findByAuthor(authorId: string) {
    const articles = await this.blogArticleModel.find({ authorId }).exec();
    return this.getArticleData(articles, ['content']);
  }

  async findByTagName(tag: string) {
    const articles = await this.blogArticleModel.find({ tags: tag }).exec();
    return this.getArticleData(articles, ['content']);
  }

  async update(id: string, data: UpdateBlogArticleDTO) {
    const article = await this.blogArticleModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    return this.getArticleData(article);
  }

  async remove(id: string) {
    const article = await this.blogArticleModel.findByIdAndDelete(id).exec();
    return this.getArticleData(article);
  }

  private getArticleData(
    data: Document<unknown, {}, BlogArticle> &
      BlogArticle & { _id: Types.ObjectId } & { __v: number },
    exclude?: (keyof BlogArticle)[],
  ): ResponseArticle<BlogArticle>;
  private getArticleData(
    data: (Document<unknown, {}, BlogArticle> &
      BlogArticle & { _id: Types.ObjectId } & { __v: number })[],
    exclude?: (keyof BlogArticle)[],
  ): ResponseArticle<BlogArticle>[];
  private getArticleData(data: any, exclude?: (keyof BlogArticle)[]): any {
    return filterData(
      data,
      exclude && exclude.length ? ['type', ...exclude] : ['type'],
    );
  }
}
