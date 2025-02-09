import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType } from '@nestjs/mapped-types';
import { Article } from '../article.schema';
import { Types } from 'mongoose';

@Schema()
export class CourseArticle extends OmitType(Article, ['type'] as const) {
  @Prop({ required: true })
  course: Types.ObjectId;
  @Prop({ required: true, min: 1 })
  number: number;
}

export const CourseArticleSchema = SchemaFactory.createForClass(CourseArticle);
CourseArticleSchema.index(
  { course: 1, number: 1 },
  { name: 'course_article_idx', unique: true },
);
