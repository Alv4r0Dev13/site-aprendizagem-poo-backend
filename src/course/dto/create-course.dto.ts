import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CourseType } from 'src/utils/enum/CourseType.enum';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CourseType)
  @IsNotEmpty()
  type: CourseType;

  @IsString()
  @IsOptional()
  thumbnail?: string;
}
