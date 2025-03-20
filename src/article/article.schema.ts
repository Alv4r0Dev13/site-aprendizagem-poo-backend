import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ discriminatorKey: 'type', timestamps: true })
export class Article {
  @Prop({ required: true, enum: ['CourseArticle', 'BlogArticle'] })
  type: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true, unique: true })
  slug: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: false })
  images: string[];
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
ArticleSchema.index(
  { title: 'text' },
  {
    name: 'article_idx',
    collation: { locale: 'en', strength: 1 },
    unique: true,
  },
);
