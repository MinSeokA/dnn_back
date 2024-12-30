import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Announce } from './entity/announce.entity';
import { Repository } from 'typeorm';
import { AnnounceDto } from './dto/announce.dto';
import { FileSystemService } from 'src/file-system/file-system.service';

@Injectable()
export class AnnounceService {
  constructor(
    @InjectRepository(Announce)
    private readonly AnnounceRepository: Repository<Announce>,

    // 파일시스템 서비스
    private readonly fileService: FileSystemService
  ) {}

  // 공지사항 등록
  async createAnnounce(Announce: AnnounceDto) {
    const result = await this.AnnounceRepository.save(Announce);
    if (!result) {
      return { message: 'Announce not created', status: false };
    }

    // 파일 업로드 로직 추가
    if (Announce.file) {
      const fileUrl = await this.fileService.uploadFile(Announce.file);
      result.file = fileUrl;
      await this.AnnounceRepository.save(result);
    }


    return { message: 'Announce created', status: true, Announce: result };
  }

  // 공지사항 수정
  async updateAnnounce(Announce: AnnounceDto) {
    if (!Announce.id) {
      return { message: 'Announce ID is required', status: false }; // id가 없으면 오류 반환
    }

    const result = await this.AnnounceRepository.update(Announce.id, Announce);

    // 업데이트 실패 시 에러 메시지 반환
    if (result.affected === 0) {
      return { message: 'Announce not found', status: false };
    }
    

    return { message: 'Announce updated', status: true };
  }


  // 공지사항 삭제
  async deleteAnnounce(Announce: AnnounceDto) {
    let fileSystem = '';

    if (!Announce.id) {
      return { message: 'Announce ID is required', status: false }; // id가 없으면 오류 반환
    }
    const AnnounceData = await this.AnnounceRepository.findOne({ where: { id: Announce.id } });


    // 파일시스템에서 특정 파일 삭제
    if (AnnounceData.file) {
      fileSystem = await this.fileService.deleteFile(AnnounceData.file);
    }

    const result =  await this.AnnounceRepository.delete(AnnounceData.id);

    // 삭제 실패 시 에러 메시지 반환
    if (result.affected === 0) {
      return { message: 'Announce not found', status: false };
    }

    return { message: 'Announce deleted', status: true, fileSystem };
  }

  // 모든 공지사항 가져오기
  async findAll() {
    return this.AnnounceRepository.find();
  }

  // 특정 공지사항 가져오기
  async findOne(id: number) {
    const Announce = await this.AnnounceRepository.findOne({ where: { id } });

    if (!Announce) {
      return { message: 'Announce not found', status: false };
    }

    return { message: 'Announce found', status: true, Announce };
  }
}

