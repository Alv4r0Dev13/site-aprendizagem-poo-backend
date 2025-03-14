import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CommentContainer {
  @IsString()
  @IsNotEmpty()
  question: string;
  @IsString()
  @IsOptional()
  answer?: string;
}

export class CreateCommentDTO {
  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CommentContainer)
  at: CommentContainer;
  @IsString()
  @IsNotEmpty()
  author: string;
  @IsString()
  @IsNotEmpty()
  content: string;
}
