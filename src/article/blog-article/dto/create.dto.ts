import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogArticleDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString({ each: true })
  @ArrayNotEmpty()
  @IsNotEmpty()
  tags: string[];
}
