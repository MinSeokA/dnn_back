import { Module } from '@nestjs/common';
import { AnnounceController } from './announce.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announce } from './entity/announce.entity';
import { FileSystemModule } from 'src/file-system/file-system.module';
import { AnnounceService } from './Announce.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Announce]),
    FileSystemModule
  ],
  providers: [AnnounceService],
  controllers: [AnnounceController]
})
export class AnnounceModule {}

