import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare(pass, user.password_hash)) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, is_admin: user.is_admin };
    return {
      access_token: this.jwtService.sign(payload),
      user: user
    };
  }

  async register(userData: any) {
    const existing = await this.usersService.findOneByEmail(userData.email);
    if (existing) throw new ConflictException('البريد الإلكتروني موجود بالفعل');

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.create({
      ...userData,
      password_hash: hashedPassword
    });

    return this.login(user);
  }
}
