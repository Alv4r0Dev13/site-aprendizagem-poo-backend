import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './course.schema';
import { Model } from 'mongoose';
import filterData from 'src/utils/functions/filterData.function';
import { CourseType } from 'src/utils/enum/CourseType.enum';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
  ) {}

  async create(data: CreateCourseDto) {
    const course = await this.courseModel.create(data);
    return filterData(course);
  }

  async findAll(limit?: number) {
    const courses = await this.courseModel.find(null, null, { limit }).exec();
    return filterData(courses);
  }

  async findByType(type: string, negate?: boolean, limit?: number) {
    const filter = { type: negate ? { $ne: type } : type };
    let query = this.courseModel.find(filter, undefined, { limit });
    if (limit) query = query.limit(limit);
    const courses = await query.exec();
    return filterData(courses);
  }

  async findById(id: string) {
    const course = await this.courseModel.findById(id).exec();
    return filterData(course);
  }

  async update(id: string, data: UpdateCourseDto) {
    const course = await this.courseModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    return filterData(course);
  }

  async remove(id: string) {
    const course = await this.courseModel.findByIdAndDelete(id).exec();
    return filterData(course);
  }
}
