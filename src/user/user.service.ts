import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Document, Model, Types } from 'mongoose';
import { AuthConfig } from '../utils/security/Auth.config';
import { SignInDTO } from './dto/signIn.dto';
import { UpdateUserDTO } from './dto/update.dto';
import { ResponseUser } from 'src/utils/types';
import { LogInDTO } from './dto/logIn.dto';
import filterData from '../utils/functions/filterData.function';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly auth: AuthConfig,
  ) {}

  async login({ login, password }: LogInDTO) {
    const user = await this.userModel
      .findOne({
        $or: [{ username: login }, { email: login }],
      })
      .exec();
    if (!user) return null;
    if (!this.auth.comparePassword(password, user.password))
      return this.getUserData(user);
    const { email, type } = user;
    const token = await this.auth.generateToken({ email, type });
    return {
      token,
      ...this.getUserData(user),
    };
  }

  async create(data: SignInDTO) {
    data = this.auth.encryptPassword(data);
    const user = await this.userModel.create(data);
    const { email, type } = user;
    const token = await this.auth.generateToken({ email, type });
    return {
      token,
      ...this.getUserData(user),
    };
  }

  async find() {
    const users = await this.userModel.find().exec();
    return this.getUserData(users);
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();
    return this.getUserData(user);
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    return this.getUserData(user);
  }

  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username }).exec();
    return this.getUserData(user);
  }

  async update(id: string, data: UpdateUserDTO) {
    if (data.password) data = this.auth.encryptPassword(data);
    const updated = await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    return this.getUserData(updated);
  }

  async delete(id: string) {
    const deleted = await this.userModel.findByIdAndDelete(id);
    return this.getUserData(deleted);
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
