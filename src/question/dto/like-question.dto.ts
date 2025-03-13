import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LikeQuestionDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;
  @IsBoolean()
  @IsOptional()
  unlike?: boolean;
}
