import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CourseType } from 'src/utils/enum/CourseType.enum';

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(CourseType)
  @IsOptional()
  type?: CourseType;

  @IsNumber()
  @IsOptional()
  classes?: number;

  @IsString()
  @IsOptional()
  thumbnail?: string;
}
