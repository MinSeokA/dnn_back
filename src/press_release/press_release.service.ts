import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { press_release } from './entity/press_release.entity';
import { Repository } from 'typeorm';
import { press_releaseDto } from './dto/press_release.dto';
import { FileSystemService } from 'src/file-system/file-system.service';

@Injectable()
export class press_releaseService {
  constructor(
    @InjectRepository(press_release)
    private readonly press_releaseRepository: Repository<press_release>,

    // 파일시스템 서비스
    private readonly fileService: FileSystemService
  ) {}

  // 공지사항 등록
  async createpress_release(press_release: press_releaseDto) {
    const result = await this.press_releaseRepository.save(press_release);
    if (!result) {
      return { message: 'press_release not created', status: false };
    }

    // 파일 업로드 로직 추가
    if (press_release.file) {
      const fileUrl = await this.fileService.uploadFile(press_release.file);
      result.file = fileUrl;
      await this.press_releaseRepository.save(result);
    }

    return { message: 'press_release created', status: true, press_release: result };
  }

  // 공지사항 수정
  async updatepress_release(press_release: press_releaseDto) {
    if (!press_release.id) {
      return { message: 'press_release ID is required', status: false }; // id가 없으면 오류 반환
    }

    const result = await this.press_releaseRepository.update(press_release.id, press_release);

    // 업데이트 실패 시 에러 메시지 반환
    if (result.affected === 0) {
      return { message: 'press_release not found', status: false };
    }

    return { message: 'press_release updated', status: true };
  }

  // 공지사항 삭제
  async deletepress_release(press_release: press_releaseDto) {
    let fileSystem = '';
    if (!press_release.id) {
      return { message: 'press_release ID is required', status: false }; // id가 없으면 오류 반환
    }

    const press_releaseData =  await this.press_releaseRepository.findOne({ where: { id: press_release.id } });


    // 파일시스템에서 특정 파일 삭제
    if (press_releaseData.file) {
      fileSystem = await this.fileService.deleteFile(press_releaseData.file);
    }

    const result =  await this.press_releaseRepository.delete(press_releaseData.id);

    // 삭제 실패 시 에러 메시지 반환
    if (result.affected === 0) {
      return { message: 'press_release not found', status: false };
    }

    return { message: 'press_release deleted', status: true, fileSystem };
  }

  // 모든 공지사항 가져오기
  async findAll() {
    return this.press_releaseRepository.find();
  }

  // 특정 공지사항 가져오기
  async findOne(id: number) {
    const press_release = await this.press_releaseRepository.findOne({ where: { id } });

    if (!press_release) {
      return { message: 'press_release not found', status: false };
    }

    return { message: 'press_release found', status: true, press_release };
  }
}

