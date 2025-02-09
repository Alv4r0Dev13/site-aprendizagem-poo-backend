import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType } from '@nestjs/mapped-types';
import { Article } from '../article.schema';
import { Types } from 'mongoose';

@Schema()
export class BlogArticle extends OmitType(Article, ['type'] as const) {
  @Prop({ required: true })
  authorId: Types.ObjectId;
  @Prop({ required: true })
  tags: string[];
}

export const BlogArticleSchema = SchemaFactory.createForClass(BlogArticle);
