import { Injectable } from '@nestjs/common';
import { UploadToProvider } from './upload-to-provider';
import { Express } from 'express';
@Injectable()
export class UploadsService {
  constructor(
    private readonly uploadToProvider: UploadToProvider,
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    return this.uploadToProvider.uploadFileToCloudinary(file);
  }
}
