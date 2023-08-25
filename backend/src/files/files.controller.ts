import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Delete,
  Param,
  Query,
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
    return this.filesService.uploadFile(file);
  }

  @Get()
  getFiles(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 12,
  ) {
    return this.filesService.getFiles(page, limit);
  }

  @Delete(':filename')
  deleteFile(@Param('filename') filename: string) {
    return this.filesService.deleteFile(filename);
  }
}
