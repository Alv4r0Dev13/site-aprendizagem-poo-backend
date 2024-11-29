import { IsOptional, IsString } from 'class-validator';

export class EditUserDTO {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  avatarUrl: string;
}
