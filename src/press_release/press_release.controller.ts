import { Body, Controller, Delete, Get, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { press_releaseService } from './press_release.service';
import { press_releaseDto } from './dto/press_release.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'multer';

@Controller('press_release')
export class press_releaseController {
  constructor(
    private readonly press_releaseService: press_releaseService,
  ) {}

  // 공지사항 등록
  // POST /press_release/create
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('file')) // 파일 업로드 처리
  async createpress_release(
    @Body() press_release: press_releaseDto,
    @UploadedFile() file: File, // 파일 받기
  ) {
    if (file) {
      press_release.file = file; // 파일을 press_release 객체에 추가
    }

    return this.press_releaseService.createpress_release(press_release);
  }

  // 공지사항 수정
  // POST /press_release/update
  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updatepress_release(
    @Body() press_release: press_releaseDto,
  ) {
    return this.press_releaseService.updatepress_release(press_release);
  }

  // 공지사항 삭제
  // POST /press_release/delete
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deletepress_release(
    @Body() press_release: press_releaseDto,
  ) {
    return this.press_releaseService.deletepress_release(press_release);
  }

  // 모든 공지사항 가져오기
  // GET /press_release/all
  @Get('all')
  async findAll() {
    return this.press_releaseService.findAll();
  }

  // 특정 공지사항 가져오기
  // POST /press_release/one
  @Post('one')
  async findOne(
    @Body() press_release: press_releaseDto,
  ) {
    return this.press_releaseService.findOne(press_release.id);
  }
}
