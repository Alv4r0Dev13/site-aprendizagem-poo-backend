import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CourseType } from 'src/utils/enum/CourseType.enum';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(CourseType)
  type: CourseType;
}
