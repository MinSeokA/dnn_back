import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api'); // 전역 접두사 설정

  // CORS 설정
  app.enableCors({
    origin: [
      "http://localhost:5173",   // 로컬 개발 서버
      "https://dnn-corp.pages.dev", // 실제 배포 URL
      "*"
    ],
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  });

  await app.listen(3000);
}
bootstrap();
