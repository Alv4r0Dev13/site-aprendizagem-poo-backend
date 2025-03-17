import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCourseArticleDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  course: string;

  @IsString()
  @IsNotEmpty()
  module: string;

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  number: number;
}
