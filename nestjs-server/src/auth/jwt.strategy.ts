// src/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'Adung1703'),
    });
  }

  async validate(payload: any) {

    const expiresAt = new Date(payload.exp * 1000);
    
    this.logger.log(`Token validation - username: ${payload.username}`);
    this.logger.log(`Token expires at: ${expiresAt.toISOString()}`);
    
    // Tính thời gian còn lại
    const now = new Date();
    const remainingTimeMinutes = Math.round((expiresAt.getTime() - now.getTime()) / (1000 * 60));
    
    this.logger.log(`Remaining token validity: ${remainingTimeMinutes} minutes`);

    return { username: payload.username };
  }

}