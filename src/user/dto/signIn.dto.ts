import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from 'src/utils/enum/UserType.enum';

export class SignInDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserType)
  type: UserType;
}
