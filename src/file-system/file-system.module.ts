import { Module } from '@nestjs/common';
import { FileSystemService } from './file-system.service';
import { FileSystemController } from './file-system.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule
  ],
  providers: [FileSystemService],
  controllers: [FileSystemController],
  exports: [FileSystemService],  // 다른 모듈에서 사용하도록 FileService를 export
})
export class FileSystemModule {}
