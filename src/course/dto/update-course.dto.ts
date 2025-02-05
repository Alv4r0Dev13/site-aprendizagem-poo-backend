import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CourseType } from 'src/utils/enum/CourseType.enum';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(CourseType)
  type?: CourseType;
}
