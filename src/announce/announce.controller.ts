import { Body, Controller, Delete, Get, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AnnounceService } from './announce.service';
import { AnnounceDto } from './dto/announce.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'multer';

@Controller('announce')
export class AnnounceController {
  constructor(
    private readonly announceService: AnnounceService,
  ) {}

  // 공지사항 등록
  // POST /Announce/create
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('file')) // 파일 업로드 처리
  async createAnnounce(
    @Body() Announce: AnnounceDto,
    @UploadedFile() file: File, // 파일 받기
  ) {
    if (file) {
      Announce.file = file; // 파일을 Announce 객체에 추가
    }

    return this.announceService.createAnnounce(Announce);
  }

  // 공지사항 수정
  // POST /Announce/update
  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateAnnounce(
    @Body() Announce: AnnounceDto,
  ) {
    return this.announceService.updateAnnounce(Announce);
  }

  // 공지사항 삭제
  // POST /Announce/delete
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteAnnounce(
    @Body() Announce: AnnounceDto,
  ) {
    return this.announceService.deleteAnnounce(Announce);
  }

  // 모든 공지사항 가져오기
  // GET /Announce/all
  @Get('all')
  async findAll() {
    return this.announceService.findAll();
  }

  // 특정 공지사항 가져오기
  // POST /Announce/one
  @Post('one')
  async findOne(
    @Body() Announce: AnnounceDto,
  ) {
    return this.announceService.findOne(Announce.id);
  }
}
