import { Types } from 'mongoose';
import { User } from 'src/user/user.schema';

export type ResponseUser = APIResponse<Omit<User, 'password'>> & {
  token?: string;
};
export type APIResponse<T> = Partial<T> & { id: Types.ObjectId };
