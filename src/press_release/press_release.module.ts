import { Module } from '@nestjs/common';
import { press_releaseController } from './press_release.controller';
import { press_releaseService } from './press_release.service';
import { FileSystemModule } from 'src/file-system/file-system.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { press_release } from './entity/press_release.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([press_release]),
    FileSystemModule
  ],
  controllers: [press_releaseController],
  providers: [press_releaseService]
})

export class PressReleaseModule {}

