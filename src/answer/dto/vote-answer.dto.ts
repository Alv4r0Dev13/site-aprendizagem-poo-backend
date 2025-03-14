import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VoteAnswerDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;
  @IsBoolean()
  @IsOptional()
  downvote?: boolean;
  @IsBoolean()
  @IsOptional()
  undo?: boolean;
}
