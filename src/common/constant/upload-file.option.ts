import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import { Request } from 'express';

export function multerOptions(
  path: string,
  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) => void,
): MulterOptions {
  return {
    storage: multer.diskStorage({
      destination: `src/public/${path}`,
      filename,
    }),
  };
}
