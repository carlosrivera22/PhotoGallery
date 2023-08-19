import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { File } from 'multer';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', new FilesService().createMulterOptions()),
  )
  uploadFile(@UploadedFile() file: File) {
    return { message: 'File uploaded successfully', file };
  }

  @Get()
  getFiles() {
    return this.filesService.getFiles();
  }
}
