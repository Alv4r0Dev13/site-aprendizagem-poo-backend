import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserType } from 'src/utils/enum/UserType.enum';

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  username: string;
  @Prop({ unique: true, required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true, default: 'STUDENT' })
  type: UserType;
  @Prop({ required: false })
  avatarUrl?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
