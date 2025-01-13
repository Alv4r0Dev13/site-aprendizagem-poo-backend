import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthConfig {
  constructor(private readonly jwtService: JwtService) {}

  encryptPassword<T extends { password?: string }>(object: T): T {
    object.password = bcrypt.hashSync(
      object.password,
      Number(process.env.BCRYPT_SALT),
    );
    return object;
  }

  comparePassword(password: string, encryptedPassword: string): boolean {
    return bcrypt.compareSync(password, encryptedPassword);
  }

  async generateToken(data: any): Promise<string> {
    return await this.jwtService.signAsync(data);
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch {
      return null;
    }
  }
}
