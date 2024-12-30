import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from './entity/notice.entity';
import { Repository } from 'typeorm';
import { NoticeDto } from './dto/notice.dto';
import { FileSystemService } from 'src/file-system/file-system.service';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,

    // 파일시스템 서비스
    private readonly fileService: FileSystemService,
  ) {}

  // 공지사항 등록
  async createNotice(notice: NoticeDto) {
    const result = await this.noticeRepository.save(notice);
    if (!result) {
      return { message: 'Notice not created', status: false };
    }

    // 파일 업로드 로직 추가
    if (notice.file) {
      const fileUrl = await this.fileService.uploadFile(notice.file);
      result.file = fileUrl;
      await this.noticeRepository.save(result);
    }

    return { message: 'Notice created', status: true, notice: result };
  }

  // 공지사항 수정
  async updateNotice(notice: NoticeDto) {
    if (!notice.id) {
      return { message: 'Notice ID is required', status: false }; // id가 없으면 오류 반환
    }

    const result = await this.noticeRepository.update(notice.id, notice);

    // 업데이트 실패 시 에러 메시지 반환
    if (result.affected === 0) {
      return { message: 'Notice not found', status: false };
    }

    return { message: 'Notice updated', status: true };
  }

  // 공지사항 삭제
  async deleteNotice(notice: NoticeDto) {    
    let fileSystem = '';
    if (!notice.id) {
      return { message: 'Notice ID is required', status: false };
    }

    const noticeData = await this.noticeRepository.findOne({ where: { id: notice.id } });
  
  
    // 파일시스템에서 특정 파일 삭제
    if (noticeData.file) {
      fileSystem = await this.fileService.deleteFile(noticeData.file);
    }

    const result = await this.noticeRepository.delete(noticeData.id);

    if (result.affected === 0) {
      return { message: 'Notice not found', status: false };
    }
  
    return { message: 'Notice deleted', status: true, fileSystem };
  }
  
  // 모든 공지사항 가져오기
  async findAll() {
    return this.noticeRepository.find();
  }

  // 특정 공지사항 가져오기
  async findOne(id: number) {
    const notice = await this.noticeRepository.findOne({ where: { id } });

    if (!notice) {
      return { message: 'Notice not found', status: false };
    }

    return { message: 'Notice found', status: true, notice };
  }
}
