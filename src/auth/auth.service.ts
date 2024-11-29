import { Injectable } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BCrypt } from 'src/utils/security/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(authDTO: AuthDTO) {
    const user = await this.userService.findByEmail(authDTO.email);
    if (!user) return null;
    if (BCrypt.verifyPassword(authDTO.password, user.password)) {
      const { email } = user;
      const token = this.jwtService.sign({ email });
      return {
        token,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      };
    }
  }
}
