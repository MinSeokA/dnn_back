import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // 전역 접두사 설정

  // CORS 설정
  app.enableCors({
    origin: [
      "*"
    ],
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  });

  await app.listen(3000);
}
bootstrap();
