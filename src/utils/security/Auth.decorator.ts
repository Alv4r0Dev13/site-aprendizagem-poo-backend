import { SetMetadata } from '@nestjs/common';
import { UserType } from '../enum/UserType.enum';

export const IS_PUBLIC_KEY = 'isPublic';
export const TYPE_KEY = 'type';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Accept = (...types: UserType[]) => SetMetadata(TYPE_KEY, types);
