import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { InternalServerError, NotFound } from '../../core/errors';
import { Translation } from '../../database/entity';
import { Translate } from '../../services';

/**
 * Delete translation
 * @param req Request
 * @param res Response
 * @param next
 */
export const deleteTranslation = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const translationId: string = req.params.translationId;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const translation: Translation = await Database.translationRepository.findById({ id: translationId });
  if (!translation) {
    return next(new NotFound(await Translate.get(languageCode, 'translation_not_found')));
  }

  await Database.translationRepository.softRemove(translation);

  await Translate.instance.init();

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, `translation_delete_success`),
  });
});

/**
 * Restore translation
 * @param req Request
 * @param res Response
 * @param next
 */
export const restoreTranslation = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const ids = req.body?.ids;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const result = await Database.translationRepository.bulkRestore(ids);
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'translation_restore_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'translation_restore_success'),
    result,
  });
});
