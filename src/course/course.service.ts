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
    const created = await this.courseModel.create(data);
    const course = await created.populate({
      path: 'author',
      select: '_id username type avatarUrl',
    });
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
      .populate({ path: 'author', select: '_id username type avatarUrl' })
      .exec();
    return filterData(course);
  }

  async updateClasses(id: string, add: number, module?: string) {
    const query =
      module && add > 0 ? { _id: id, modules: { $ne: module } } : id;
    const update = { $inc: { classes: add } };
    if (module) {
      if (add > 0) update['$push'] = { modules: module };
      else update['$pull'] = { modules: module };
    }
    console.log(update);
    const course = await this.courseModel
      .findByIdAndUpdate(query, update, { new: true })
      .populate({ path: 'author', select: '_id username type avatarUrl' })
      .exec();
    return filterData(course);
  }

  async remove(id: string) {
    const course = await this.courseModel.findByIdAndDelete(id).exec();
    return filterData(course);
  }
}
