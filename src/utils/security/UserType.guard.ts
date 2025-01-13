import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TYPE_KEY } from './Auth.decorator';
import { UserType } from '../enum/UserType.enum';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredTypes = this.reflector.getAllAndOverride<UserType[]>(
      TYPE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredTypes) return true;
    const { user } = context.switchToHttp().getRequest();
    return requiredTypes.some(type => user.type === type);
  }
}
