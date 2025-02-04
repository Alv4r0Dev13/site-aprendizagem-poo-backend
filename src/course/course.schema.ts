import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CourseType } from 'src/utils/enum/CourseType.enum';

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, enum: CourseType })
  type: CourseType;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
