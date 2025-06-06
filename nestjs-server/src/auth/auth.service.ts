// src/auth/auth.service.ts
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService) { }

  async validateCredentials(username: string, password: string): Promise<boolean> {
    try {
      // Gọi API kiểm tra mật khẩu với phương thức GET và tham số query đúng
      const response = await axios.get('https://api.toolhub.app/hust/KiemTraMatKhau', {
        params: {
          taikhoan: username,
          matkhau: password
        }
      });

      /*
      const response = await axios.post('https://api.toolhub.app/hust/KiemTraMatKhau', {
        taikhoan: username,
        matkhau: password
      });
      */

      // Kiểm tra kết quả
      return response.data === 1;
    } catch (error) {
      this.logger.error(`Error validating credentials: ${error.message}`);
      return false;
    }
  }

  async login(username: string, password: string) {
    // Kiểm tra thông tin đăng nhập
    const isValid = await this.validateCredentials(username, password);

    if (!isValid) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    // Tạo payload
    const payload = { username };

    // Tạo JWT token
    const access_token = this.jwtService.sign(payload);

    //=================Log thời hạn của token=================
    const now = new Date();
    const decodedToken = this.jwtService.decode(access_token) as { exp: number, iat: number };
    // Chuyển đổi timestamp thành Date
    const issuedAt = new Date(decodedToken.iat * 1000);
    const expiresAt = new Date(decodedToken.exp * 1000);
    this.logger.log(`Token created at: ${issuedAt.toISOString()}`);
    this.logger.log(`Token expires at: ${expiresAt.toISOString()}`);
    this.logger.log(`Token valid for: ${(decodedToken.exp - decodedToken.iat) / 60 / 60} hours`);
    //=========================================================

    return {
      access_token,
      username,
    };
  }
}