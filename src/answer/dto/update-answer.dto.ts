import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAnswerDTO {
  @IsString()
  @IsNotEmpty()
  content: string;
}
