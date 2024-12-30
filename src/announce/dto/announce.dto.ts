import { File } from 'multer';
import { IsString, IsOptional } from 'class-validator';  // class-validator에서 가져오기

export class AnnounceDto {
    id: number;

    @IsString()
    author: string;

    @IsString()
    title: string;
    
    @IsString()
    content: string;

    @IsOptional()  // class-validator에서 가져온 IsOptional을 사용
    file?: File;  // 파일 필드 추가

    @IsString()  // image 필드는 문자열이어야 함
    image: string;

    createdAt: Date;
    updatedAt: Date;
}
