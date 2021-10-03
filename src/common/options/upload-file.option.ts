import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import * as path from 'path';
import { Request } from 'express';
import { UnsupportedMediaTypeException } from '@nestjs/common';

export function multerOptions(
  dest: string,
  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) => void,
): MulterOptions {
  return {
    storage: multer.diskStorage({
      destination: `src/public/${dest}`,
      filename,
    }),
    fileFilter: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        return cb(
          new UnsupportedMediaTypeException('Only images are allowed'),
          null,
        );
      }
      cb(null, true);
    },
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
  };
}
