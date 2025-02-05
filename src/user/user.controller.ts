import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignInDTO } from './dto/signIn.dto';
import { UpdateUserDTO } from './dto/update.dto';
import { isValidId } from 'src/utils/functions/isValidId.function';
import { Accept, Public } from 'src/utils/security/Auth.decorator';
import { LogInDTO } from './dto/logIn.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Public()
  async create(@Body() signInDTO: SignInDTO) {
    const stored = await this.userService.findByEmail(signInDTO.email);
    if (stored)
      throw new HttpException('Usuário já cadastrado.', HttpStatus.BAD_REQUEST);
    const duplicate = await this.userService.findByUsername(signInDTO.username);
    if (duplicate)
      throw new HttpException(
        'Já existe um usuário com esse nome.',
        HttpStatus.BAD_REQUEST,
      );
    return this.userService.create(signInDTO);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() logInDTO: LogInDTO) {
    const user = await this.userService.login(logInDTO);
    if (!user)
      throw new HttpException('Usuário não cadastrado.', HttpStatus.NOT_FOUND);
    if (!user.token)
      throw new HttpException('Senha incorreta.', HttpStatus.UNAUTHORIZED);
    return user;
  }

  @Get()
  async find() {
    return await this.userService.find();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    if (!isValidId(id)) throw new HttpException('Invalid ID', 400);
    const user = await this.userService.findById(id);
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() editUserDTO: UpdateUserDTO) {
    if (!isValidId(id)) throw new HttpException('Invalid ID', 400);
    const user = await this.userService.update(id, editUserDTO);
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!isValidId(id)) throw new HttpException('Invalid ID', 400);
    const user = await this.userService.delete(id);
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }
}
