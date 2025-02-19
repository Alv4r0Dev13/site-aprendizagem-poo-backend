import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { isValidId } from 'src/utils/functions/isValidId.function';
import { Accept, Public } from 'src/utils/security/Auth.decorator';
import { UserType } from 'src/utils/enum/UserType.enum';
import { CourseType } from 'src/utils/enum/CourseType.enum';
import { isEnum } from 'class-validator';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Accept(UserType.ADMIN)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Public()
  @Get()
  findAll(@Query('limit') limit: number) {
    return this.courseService.findAll(limit);
  }

  @Public()
  @Get('/type/:type')
  findByType(@Param('type') type: string, @Query('limit') limit: number) {
    let negate = false;
    if (type.startsWith('!')) {
      negate = true;
      type = type.replace('!', '');
    }
    if (!isEnum(type, CourseType))
      throw new HttpException(
        'Tipo de curso inválido.',
        HttpStatus.BAD_REQUEST,
      );
    return this.courseService.findByType(type, negate, limit);
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    if (!isValidId(id))
      throw new HttpException('Id inválido.', HttpStatus.BAD_REQUEST);
    return this.courseService.findById(id);
  }

  @Accept(UserType.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    if (!isValidId(id))
      throw new HttpException('Id inválido.', HttpStatus.BAD_REQUEST);
    return this.courseService.update(id, updateCourseDto);
  }

  @Accept(UserType.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    if (!isValidId(id))
      throw new HttpException('Id inválido.', HttpStatus.BAD_REQUEST);
    return this.courseService.remove(id);
  }
}
