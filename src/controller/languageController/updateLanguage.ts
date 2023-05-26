import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { InternalServerError, NotFound } from '../../core/errors';
import { UserJWTPayload } from '../../types/type';
import { Language, User } from '../../database/entity';
import { Translate } from '../../services';

/**
 * Update language
 * @param req Request
 * @param res Response
 * @param next
 */
export const updateLanguage = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageId: Language['id'] = req.params.languageId;
  const apiUser: UserJWTPayload = res.locals?.userPayload;
  const updatedById: User['id'] = apiUser.userId;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const language = await Database.languageRepository.findById({ id: languageId });
  if (!language) {
    return next(new NotFound(await Translate.get(languageCode, 'language_not_found')));
  }

  if (req.body.isDefault) {
    const existingDefaultLanguage = await Database.languageRepository.getDefaultLanguage();
    if (existingDefaultLanguage) {
      const updatedExistingDefaultLanguage = await Database.languageRepository.save({ ...existingDefaultLanguage, isDefault: false });
      if (!updatedExistingDefaultLanguage) {
        return next(new InternalServerError(await Translate.get(languageCode, 'default_language_toggle_error')));
      }
    }
  }

  const updatedLanguage: Language = { ...language, updatedById, ...req.body };

  const result = await Database.languageRepository.save(updatedLanguage);
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'language_update_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'language_update_success'),
    result,
  });
});

export const updateLanguageFont = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageId: string = req.params.languageId;
  const font = req.file?.path?.slice(7) || '';
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const language = await Database.languageRepository.findById({ id: languageId });
  if (!language) {
    return next(new NotFound(await Translate.get(languageCode, 'language_not_found')));
  }

  const updatedLanguage: any = { ...language, font };

  const result = await Database.languageRepository.save(updatedLanguage);
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'language_font_update_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'language_font_update_success'),
    result,
  });
});
