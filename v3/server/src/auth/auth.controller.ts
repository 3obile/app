import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: any) {
    return this.authService.register(userData);
  }

  @Post('login')
  async login(@Body() loginData: any) {
    const user = await this.authService.validateUser(loginData.email, loginData.password);
    if (!user) {
      throw new Error('بيانات الدخول غير صحيحة');
    }
    return this.authService.login(user);
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
