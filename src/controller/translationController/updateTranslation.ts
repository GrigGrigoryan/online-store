import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { BadRequest, Conflict, InternalServerError, NotFound } from '../../core/errors';
import { Translate } from '../../services';
import { UserJWTPayload } from '../../types/type';
import { Translation, User } from '../../database/entity';

/**
 * Update translation
 * @param req Request
 * @param res Response
 * @param next
 */
export const updateTranslation = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const translationId: Translation['id'] = req.params.translationId;
  const apiUser: UserJWTPayload = res.locals?.userPayload;
  const updatedById: User['id'] = apiUser.userId;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const translation: Translation = await Database.translationRepository.findById({ id: translationId });
  if (!translation) {
    return next(new NotFound(await Translate.get(languageCode, 'translation_not_found')));
  }

  if (req.body.key && req.body.key !== translation.key) {
    const existingTranslation = await Database.translationRepository.getTranslationByKey(req.body.key);
    if (existingTranslation) {
      return next(new Conflict(await Translate.get(languageCode, 'translation_already_exists')));
    }
  }

  const updatedTranslation: any = { ...translation, updatedById, ...req.body };

  const result = await Database.translationRepository.save(updatedTranslation);
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'translation_update_error')));
  }

  await Translate.instance.init();

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'translation_update_success'),
    result,
  });
});
