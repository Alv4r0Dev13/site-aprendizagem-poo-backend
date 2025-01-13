import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthConfig } from './Auth.config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './Auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly auth: AuthConfig,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublicRoute) return true;

    const req = context.switchToHttp().getRequest();
    const token = this.getAuthHeaderToken(req);
    if (!token) throw new UnauthorizedException();

    const user = await this.auth.verifyToken(token);
    if (!user) throw new UnauthorizedException();
    req['user'] = user;
    return true;
  }

  private getAuthHeaderToken(req: Request) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
