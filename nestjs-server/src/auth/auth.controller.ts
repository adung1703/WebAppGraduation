// src/auth/auth.controller.ts
import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

class LoginDto {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto.username, loginDto.password);
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw new HttpException(
        { 
          status: HttpStatus.UNAUTHORIZED, 
          error: 'Thông tin đăng nhập không hợp lệ',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}