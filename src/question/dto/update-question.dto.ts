import { IsOptional, IsString } from 'class-validator';

export class UpdateQuestionDTO {
  @IsString()
  @IsOptional()
  title?: string;
  @IsString()
  @IsOptional()
  content?: string;
}
