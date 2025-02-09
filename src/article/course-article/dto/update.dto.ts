import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCourseArticleDTO {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}
