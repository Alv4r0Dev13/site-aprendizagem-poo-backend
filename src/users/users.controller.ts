import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignInDTO } from './dto/signIn.dto';
import { EditUserDTO } from './dto/editUser.dto';
import { isValidId } from 'src/utils/middlewares/isValidId';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() signInDTO: SignInDTO) {
    return this.usersService.create(signInDTO);
  }

  @Get()
  find() {
    return this.usersService.find();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    if (!isValidId(id)) throw new HttpException('Invalid ID', 400);
    const user = await this.usersService.findById(id);
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() editUserDTO: EditUserDTO) {
    if (!isValidId(id)) throw new HttpException('Invalid ID', 400);
    const user = await this.usersService.update(id, editUserDTO);
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!isValidId(id)) throw new HttpException('Invalid ID', 400);
    const user = await this.usersService.delete(id);
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }
}
