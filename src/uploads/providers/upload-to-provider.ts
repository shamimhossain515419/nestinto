import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Stream } from 'stream';
import { Express } from 'express';

@Injectable()
export class UploadToProvider {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  public async uploadFileToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'your-folder', // Optional: specify a folder in Cloudinary
            use_filename: true,
            unique_filename: false,
          },
          (error, result) => {
            if (error) {
              reject(`Failed to upload image: ${error.message}`);
            } else {
              resolve(result);
            }
          },
        );

        // Convert buffer to stream and pipe it to Cloudinary
        const bufferStream = new Stream.PassThrough();
        bufferStream.end(file.buffer);
        bufferStream.pipe(uploadStream);
      });
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }
}
