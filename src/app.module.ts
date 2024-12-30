import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { JwtModule } from '@nestjs/jwt'; // JwtModule 가져오기
import { NoticeModule } from './notice/notice.module';
import { FileSystemModule } from './file-system/file-system.module';
import { AnnounceModule } from './announce/announce.module';
import { PressReleaseModule } from './press_release/press_release.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역으로 사용 가능
      envFilePath: '.env', // 기본값은 .env
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '61.78.89.183', // 또는 서버 주소
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'dnn_back_dev',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: false, // SSL이 필요하지 않을 경우 false로 설정
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // 환경 변수에서 JWT 비밀 키 가져오기
      signOptions: { expiresIn: '1h' }, // JWT 만료 시간 설정
    }),
    AuthModule,
    NoticeModule,
    FileSystemModule,
    AnnounceModule,
    PressReleaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {
}
