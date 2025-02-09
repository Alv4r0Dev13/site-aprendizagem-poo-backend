import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCourseArticleDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  course: string;

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  number: number;
}
