import * as express from 'express';
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      user?: any; // 또는 필요한 타입으로 정의 (예: User 타입)
      file?: Multer.File; // single file upload
      files?: Multer.Files; // multiple files upload
    }
  }
}

