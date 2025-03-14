import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDTO {
  @IsString()
  @IsNotEmpty()
  author: string;
  @IsString()
  @IsNotEmpty()
  question: string;
  @IsString()
  @IsNotEmpty()
  content: string;
}
