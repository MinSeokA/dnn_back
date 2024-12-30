import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './entity/auth.entity';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // 회원가입
  // POST /auth/register
  @Post('register')
  async register(
    @Body() body: AuthDto,
  ) {
    return this.authService.register(body);
  }

  // 로그인
  // POST /auth/login
  @Get('login')
  async login(
    @Body() body: AuthDto,
  ) {
    const result = await this.authService.login(body);

    return result;
  }

  // 사용자 정보 가져오기
  // GET /auth/profile
  @Get('profile')
  async getProfile(
    @Body() body: AuthDto,
  ) {
    return this.authService.getProfile(body.username);
  }

  // 모든 사용자 정보 가져오기
  // GET /auth/all
  @Get('all')
  async findAll() {
    return this.authService.findAll();
  }

  // 사용자 삭제
  // DELETE /auth/delete
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async delete(
    @Body() body: AuthDto,
  ) {
    return this.authService.remove(body.id);
  }
}
