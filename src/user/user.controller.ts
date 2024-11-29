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
import { UserService } from './user.service';
import { SignInDTO } from './dto/signIn.dto';
import { EditUserDTO } from './dto/editUser.dto';
import { isValidId } from 'src/utils/middlewares/isValidId';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() signInDTO: SignInDTO) {
    return this.userService.create(signInDTO);
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
  async update(@Param('id') id: string, @Body() editUserDTO: EditUserDTO) {
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
