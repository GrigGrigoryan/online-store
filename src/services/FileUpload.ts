import multer from 'multer';
import { multerConfig } from '../config';
import { Request } from 'express';

export class FileUpload {
  static get() {
    const storage = multer.diskStorage({
      destination: multerConfig.dest,
      filename(req: Request, file: Express.Multer.File, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    });

    return multer({ storage });
  }
}
