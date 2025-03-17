import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { CourseType } from 'src/utils/enum/CourseType.enum';

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: false, ref: User.name })
  author?: Types.ObjectId;
  @Prop({ required: true, enum: CourseType })
  type: CourseType;
  @Prop({ required: false })
  thumbnail?: string;
  @Prop({ default: [] })
  modules: string[];
  @Prop({ default: 0 })
  classes: number;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
CourseSchema.index(
  { course: 1 },
  {
    name: 'course_idx',
    collation: { locale: 'pt', strength: 1 },
    unique: true,
  },
);
