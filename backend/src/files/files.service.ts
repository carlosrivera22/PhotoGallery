import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as multer from 'multer';

@Injectable()
export class FilesService {
  // Define the uploads directory as an absolute path
  private readonly uploadPath: string;

  constructor() {
    this.uploadPath = path.resolve(__dirname, '..', '..', 'uploads');
    console.log('Upload path:', this.uploadPath); // Debugging

    if (!fs.existsSync(this.uploadPath)) {
      console.log('Directory does not exist, creating...'); // Debugging
      fs.mkdirSync(this.uploadPath, { recursive: true });
      console.log('Directory created'); // Debugging
    } else {
      console.log('Directory already exists'); // Debugging
    }
  }

  createMulterOptions() {
    return {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, this.uploadPath);
        },
        filename: (req, file, cb) => {
          const filename: string =
            path.parse(file.originalname).name.replace(/\s+/g, '') + Date.now();
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`);
        },
      }),
    };
  }

  getFiles() {
    const files = fs.readdirSync(this.uploadPath);
    if (!files) {
      return [];
    }

    return files.map((file) => {
      const filePath = path.join(this.uploadPath, file);
      const fileBuffer = fs.readFileSync(filePath);
      const base64Image = fileBuffer.toString('base64');
      return {
        data: `data:image/jpeg;base64,${base64Image}`,
        name: file,
      };
    });
  }

  uploadFile(file: any) {
    const fileBuffer = fs.readFileSync(file.path);
    const base64Image = fileBuffer.toString('base64');
    return {
      data: `data:image/jpeg;base64,${base64Image}`,
      name: file.filename,
    };
  }

  deleteFile(filename: string) {
    console.debug(this.uploadPath, filename);
    const filePath = path.join(this.uploadPath, filename);
    fs.unlinkSync(filePath);
  }
}
