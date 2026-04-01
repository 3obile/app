import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('media')
export class MediaController {
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4|mov)$/)) {
            return cb(new BadRequestException('ملف غير صالح! مسموح بالصور والفيديو فقط'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  }))
  uploadFile(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('لم يتم رفع أي ملف');
    return {
      url: `http://localhost:3000/uploads/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size
    };
  }
}
