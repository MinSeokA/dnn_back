import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // JwtService 가져오기
import { ConfigService } from '@nestjs/config'; // ConfigService 가져오기
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService, // JwtService 주입
    private readonly configService: ConfigService, // ConfigService 주입
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(403).send('Token is required');
    }

    // 토큰 만료시간 확인 (1시간)
    if (Date.now() >= this.jwtService.decode(token)['exp'] * 1000) {
      return res.status(401).send('Token is expired');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'), // 환경 변수로부터 비밀 키 가져오기
      });
      if (decoded) {
        req.user = decoded;
        next();
      } else {
        return res.status(401).send('Unauthorized');
      }
    } catch (error) {
      return res.status(401).send('Unauthorized');
    }
  }
}
