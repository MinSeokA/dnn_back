import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileSystemService } from './file-system.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'multer';

@Controller('upload')
export class FileSystemController {
  constructor(
    private readonly fileSystemService: FileSystemService,
  ) {}

  // 파일 업로드
  // POST /upload
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: File) {
    const fileUrl = await this.fileSystemService.uploadFile(file);
    return fileUrl;
  }
}
