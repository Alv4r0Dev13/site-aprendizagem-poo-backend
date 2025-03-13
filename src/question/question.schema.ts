import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/user.schema';

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true, ref: User.name })
  author: Types.ObjectId;
  @Prop({ default: [] })
  likes: Types.ObjectId[];
  @Prop({ default: 0 })
  answers: number;
  @Prop({ default: 0 })
  comments: number;
  @Prop()
  correctAnswer?: Types.ObjectId;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
QuestionSchema.index(
  { title: 1 },
  {
    name: 'question_idx',
    collation: { locale: 'pt', strength: 1 },
    unique: true,
  },
);
