import { ArrayNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBlogArticleDTO {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString({ each: true })
  @ArrayNotEmpty()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  thumbnail?: string;
}
