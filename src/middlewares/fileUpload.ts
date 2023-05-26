import { Request as Req, Response as Res, NextFunction as Next, RequestHandler } from 'express';
import { FileUpload, Translate } from '../services';
import { LanguageCode } from '../types/enum';
import multer, { MulterError } from 'multer';
import { BadRequest, InternalServerError } from '../core/errors';

export const fileUpload = (fieldName: string): RequestHandler => {
  return (req: Req, res: Res, next: Next) => {
    FileUpload.get().single(fieldName)(req, res, async (err: any) => {
      if (err) {
        const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
        if (err instanceof multer.MulterError) {
          return next(new BadRequest(await Translate.get(languageCode, `${fieldName}_required`)));
        }

        return next(new InternalServerError(err.code));
      }
      return next();
    });
  };
};
