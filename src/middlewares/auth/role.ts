import { Request as Req, Response as Res, NextFunction as Next, RequestHandler } from 'express';
import { Forbidden } from '../../core/errors';
import { LanguageCode, UserRole } from '../../types/enum';
import { envConfig } from '../../config';
import { Translate } from '../../services';
import { UserJWTPayload } from '../../types/type';

export const role = async (req: Req, res: Res, next: Next): Promise<void> => {
  const userPayload: UserJWTPayload = res.locals?.userPayload;
  const languageCode: LanguageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const apiKey: string = req.headers['x-api-key'] as string;

  if (apiKey === envConfig.apiKey) {
    return next();
  }

  switch (userPayload?.role?.name) {
    case UserRole.SUPER_ADMIN:
    case UserRole.ADMIN:
      return next();
    case UserRole.CLIENT:
      return next(new Forbidden(await Translate.get(languageCode, 'role_required')));
    default:
      return next(new Forbidden(await Translate.get(languageCode, 'role_required')));
  }
};
