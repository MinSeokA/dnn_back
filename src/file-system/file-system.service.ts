import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { File } from 'multer';

@Injectable()
export class FileSystemService {
  private s3: AWS.S3;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME');

    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('R2_SECRET_ACCESS_KEY'),
      endpoint: this.configService.get<string>('R2_ENDPOINT'),
      signatureVersion: 'v4',
      region: 'auto',
      s3ForcePathStyle: true,
    });
  }

  // 파일 업로드
  async uploadFile(file: File): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: `${Date.now()}-${file.originalname}`, // 파일 이름을 고유하게 생성
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const result = await this.s3.upload(params).promise();
    return result.Location; // 업로드한 파일의 URL을 반환
  }

  // 특정 파일 삭제
  // 특정 파일 삭제
  async deleteFile(fileUrl: string): Promise<any> {
    try {
      // URL에서 파일 이름 추출 (Cloudflare R2의 URL 형식을 맞추기 위한 split 처리)
      const key = fileUrl.split('dnn-filesystem/dnn-filesystem/')[1];

      if (!key) {
        console.error('File key is missing');
        return 'File key is missing';
      }

      const params = {
        Bucket: this.bucketName,
        Key: key, // Cloudflare R2 객체 키
      };

      // 파일 삭제 요청
      const result = await this.s3.deleteObject(params).promise();

      if (result.$response.error) {
        console.error('Error deleting file:', result.$response.error);
        return `Error deleting file: ${result.$response.error.message}`;
      }

      console.log('File deleted successfully:', result);
      return 'File deleted';
    } catch (error) {
      console.error('Error deleting file:', error.message || error);
      return `Error deleting file: ${error.message || error}`;
    }
  }
}
