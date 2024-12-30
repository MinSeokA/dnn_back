import { Body, Controller, Delete, Get, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeDto } from './dto/notice.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'multer';

@Controller('notice')
export class NoticeController {
  constructor(
    private readonly noticeService: NoticeService,
  ) {}

  // 공지사항 등록
  // POST /notice/create
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('file')) // 파일 업로드 처리
  async createNotice(
    @Body() notice: NoticeDto,
    @UploadedFile() file: File, // 파일 받기
  ) {
    if (file) {
      notice.file = file; // 파일을 notice 객체에 추가
    }

    return this.noticeService.createNotice(notice);
  }

  // 공지사항 수정
  // POST /notice/update
  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateNotice(
    @Body() notice: NoticeDto,
  ) {
    return this.noticeService.updateNotice(notice);
  }

  // 공지사항 삭제
  // POST /notice/delete
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteNotice(
    @Body() notice: NoticeDto,
  ) {
    return this.noticeService.deleteNotice(notice);
  }

  // 모든 공지사항 가져오기
  // GET /notice/all
  @Get('all')
  async findAll() {
    return this.noticeService.findAll();
  }

  // 특정 공지사항 가져오기
  // POST /notice/one
  @Post('one')
  async findOne(
    @Body() notice: NoticeDto,
  ) {
    return this.noticeService.findOne(notice.id);
  }
}
