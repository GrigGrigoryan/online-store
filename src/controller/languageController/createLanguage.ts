import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { InternalServerError } from '../../core/errors';
import { UserJWTPayload } from '../../types/type';
import { User } from '../../database/entity';
import { Translate } from '../../services';

/**
 * Create language
 * @param req Request
 * @param res Response
 * @param next
 */
export const createLanguage = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const apiUser: UserJWTPayload = res.locals?.userPayload;
  const createdById: User['id'] = apiUser.userId;

  if (req.body.isDefault) {
    const existingDefaultLanguage = await Database.languageRepository.getDefaultLanguage();
    if (existingDefaultLanguage) {
      const updatedExistingDefaultLanguage = await Database.languageRepository.save({
        ...existingDefaultLanguage,
        isDefault: false,
      });
      if (!updatedExistingDefaultLanguage) {
        return next(new InternalServerError(await Translate.get(languageCode, 'default_language_toggle_error')));
      }
    }
  }

  const result = await Database.languageRepository.createAndSave({ ...req.body, createdById });
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'language_create_error')));
  }

  return res.status(StatusCode.CREATED).send({
    message: await Translate.get(languageCode, 'language_create_success'),
    result,
  });
});
