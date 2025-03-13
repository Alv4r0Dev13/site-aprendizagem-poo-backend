import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsString()
  @IsNotEmpty()
  author: string;
}
