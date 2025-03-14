import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Question } from 'src/question/question.schema';
import { User } from 'src/user/user.schema';

@Schema({ timestamps: true })
export class Answer {
  @Prop({ required: true, ref: User.name })
  author: Types.ObjectId;
  @Prop({ required: true, ref: Question.name })
  question: Types.ObjectId;
  @Prop({ required: true })
  content: string;
  @Prop({ default: [] })
  upvotes: Types.ObjectId[];
  @Prop({ default: [] })
  downvotes: Types.ObjectId[];
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
