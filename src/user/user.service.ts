import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Document, Model, Types } from 'mongoose';
import { SignInDTO } from './dto/signIn.dto';
import { EditUserDTO } from './dto/editUser.dto';
import { BCrypt } from 'src/utils/security/bcrypt';
import { ResponseUser } from 'src/utils/types';
import filterData from 'src/utils/functions/filterData.function';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: SignInDTO) {
    const newUser = new this.userModel(BCrypt.encryptPassword(data));
    const user = await newUser.save();
    return this.getUserData(user);
  }

  async find() {
    return await this.userModel.find().exec();
  }

  async findById(id: string) {
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async update(id: string, data: EditUserDTO) {
    return await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async delete(id: string) {
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  private getUserData(
    data: Document<unknown, {}, User> &
      User & { _id: Types.ObjectId } & { __v: number },
    exclude?: (keyof Omit<User, 'password'>)[],
  ): ResponseUser;
  private getUserData(
    data: (Document<unknown, {}, User> &
      User & { _id: Types.ObjectId } & { __v: number })[],
    exclude?: (keyof Omit<User, 'password'>)[],
  ): ResponseUser[];
  private getUserData(
    data: any,
    exclude?: (keyof Omit<User, 'password'>)[],
  ): any {
    return filterData(
      data,
      exclude && exclude.length ? ['password', ...exclude] : ['password'],
    );
  }
}
