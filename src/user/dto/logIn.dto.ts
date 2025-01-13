import { IsNotEmpty, IsString } from 'class-validator';

export class LogInDTO {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
