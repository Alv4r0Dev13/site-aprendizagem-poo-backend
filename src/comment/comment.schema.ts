import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/user.schema';

@Schema({ _id: false })
class CommentContainer {
  @Prop({ required: true })
  question: Types.ObjectId;
  @Prop()
  answer?: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  at: CommentContainer;
  @Prop({ required: true, ref: User.name })
  author: Types.ObjectId;
  @Prop({ required: true })
  content: string;
  @Prop()
  createdAt: Date;
  @Prop()
  udpatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
