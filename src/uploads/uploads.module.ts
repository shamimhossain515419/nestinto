import { Module } from '@nestjs/common';
import { UploadsService } from './providers/uploads.service';
import { UploadToProvider } from './providers/upload-to-provider';
import { UploadController } from './uploads.controller';

@Module({
  controllers: [UploadController],
  providers: [UploadsService, UploadToProvider],
})
export class UploadsModule {}
