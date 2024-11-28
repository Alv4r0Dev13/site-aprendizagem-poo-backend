import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { Model } from 'mongoose';
import { SignInDTO } from './dto/signIn.dto';
import { EditUserDTO } from './dto/editUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(data: SignInDTO) {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  find() {
    const users = this.userModel.find();
    return users;
  }

  findById(id: string) {
    const user = this.userModel.findById(id);
    return user;
  }

  findByEmail(email: string) {
    const user = this.userModel.findOne({ email });
    return user;
  }

  update(id: string, data: EditUserDTO) {
    const updated = this.userModel.findByIdAndUpdate(id, data, { new: true });
    return updated;
  }

  delete(id: string) {
    const deleted = this.userModel.findByIdAndDelete(id);
    return deleted;
  }
}
