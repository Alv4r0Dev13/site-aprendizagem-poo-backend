import { Types } from 'mongoose';
import { Article } from 'src/article/article.schema';
import { User } from 'src/user/user.schema';

export type APIResponse<T> = Partial<T> & { id: Types.ObjectId };

export type ResponseUser = APIResponse<Omit<User, 'password'>> & {
  token?: string;
};

export type ResponseArticle<T extends Omit<Article, 'type'>> = APIResponse<
  Omit<T, 'type'>
>;
