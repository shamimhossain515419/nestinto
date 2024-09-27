import { AuthType } from './../auth/enums/auth-type.enum';
import { Auth } from './../auth/decorators/auth.decorator';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './providers/uploads.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @Auth(AuthType.None)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File is missing');
    }
    const result = await this.uploadsService.uploadFile(file);
    return result;
  }
}
