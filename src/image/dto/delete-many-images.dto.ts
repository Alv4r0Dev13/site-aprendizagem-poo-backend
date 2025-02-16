import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class DeleteManyImagesDTO {
  @IsString({ each: true })
  @ArrayNotEmpty()
  @IsNotEmpty()
  files: string[];
}
