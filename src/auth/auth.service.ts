import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './entity/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>, // Repository 주입
    
    // 데이터베이스, jwt 모듈 등을 주입
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,    
  ) {}

  // 회원가입 / 비밀번호 암호화
  async register(user: AuthDto) {  
    const hashedPassword = await this.hashPassword(user.password);

    return this.authRepository.save({ ...user, password: hashedPassword });
  }


  // 로그인 메서드
  async login(authDto: AuthDto) {
    const user = await this.validateUser(authDto.username, authDto.password);

    if (!user) {
      return { message: 'Invalid username or password', status: false };
    }

    // JWT 토큰 생성
    const payload = { username: user.username, sub: user.id };
    return {
      message: 'Login success',
      status: true,
      access_token: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      }),
    };
  }
  // 모든 유저 정보 가져오기 (비밉번호 제외)
  async findAll() {
    const users = await this.authRepository.find();
    return users.map(({ password, ...result }) => result);
  }

  // 특정 유저 정보 가져오기 (비밉번호 제외)
  async getProfile(username: string) {
    const user = await this.authRepository.findOne({ where: { username } });
    if (user) {
      const { password, ...result } = user;
      return result;
    } else {
      return { message: 'User not found', status: false };
    }
  }

  // 사용자 삭제
  async remove(id: number): Promise<any> {
    const user = await this.authRepository.findOne({ where: { id } });

    if (!user) {
      return { message: 'User not found', status: false };
    }

    await this.authRepository.remove(user);
    
    return {
      message: 'User deleted',
      status: true,
    }
  }

  // 사용자 정보를 검증하는 메서드
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.authRepository.findOne({ where: { username } });

    if (user && await bcrypt.compare(password, user.password)) {
      // 비밀번호가 일치하면 사용자 정보 반환
      const { password, ...result } = user;
      return result;
    }

    // 비밀번호가 일치하지 않으면 오류 메시지 반환
    return null;
  }

  // 비밀번호 암호화 Bcryptjs 사용
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(password, salt);
  }
}

// src/auth/auth.controller.ts

