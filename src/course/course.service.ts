import { Injectable } from '@nestjs/common';
import { CreateCourseDTO } from './dto/create-course.dto';
import { UpdateCourseDTO } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './course.schema';
import { Model } from 'mongoose';
import filterData from 'src/utils/functions/filterData.function';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
  ) {}

  async create(data: CreateCourseDTO) {
    const course = await this.courseModel.create(data);
    return filterData(course);
  }

  async findAll(limit?: number) {
    const courses = await this.courseModel
      .find(null, null, { limit })
      .populate('author', '_id username')
      .exec();
    return filterData(courses);
  }

  async findByType(type: string, negate?: boolean, limit?: number) {
    const filter = { type: negate ? { $ne: type } : type };
    const courses = await this.courseModel
      .find(filter, null, { limit })
      .populate({ path: 'author', select: '_id username type avatarUrl' })
      .exec();
    return filterData(courses);
  }

  async findById(id: string) {
    const course = await this.courseModel
      .findById(id)
      .populate({ path: 'author', select: '_id username type avatarUrl' })
      .exec();
    return filterData(course);
  }

  async update(id: string, data: UpdateCourseDTO) {
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
