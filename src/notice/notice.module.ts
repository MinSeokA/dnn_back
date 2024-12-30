import { Module } from '@nestjs/common';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entity/notice.entity';
import { FileSystemModule } from 'src/file-system/file-system.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notice]),
    FileSystemModule
  ],
  controllers: [NoticeController],
  providers: [NoticeService]
})
export class NoticeModule {}
