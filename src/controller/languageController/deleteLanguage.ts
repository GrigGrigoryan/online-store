import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { BadRequest, InternalServerError, NotFound } from '../../core/errors';
import fs from 'fs';
import { Language } from '../../database/entity';
import { Translate } from '../../services';

/**
 * Delete language
 * @param req Request
 * @param res Response
 * @param next
 */
export const deleteLanguage = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const languageId: string = req.params.languageId;
  let result: Language;

  const language: Language = await Database.languageRepository.findById({ id: languageId });
  if (!language) {
    return next(new NotFound(await Translate.get(languageCode, 'language_not_found')));
  }

  if (language.isDefault) {
    return next(new BadRequest(await Translate.get(languageCode, 'default_language_delete_error')));
  }

  if (language.font) {
    fs.unlinkSync(`static/${language.font}`);
  }

  result = await Database.languageRepository.softRemove(language);
  if (!result) {
    return next(new BadRequest(await Translate.get(languageCode, 'language_delete_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'language_delete_success'),
    result,
  });
});

/**
 * Restore language
 * @param req Request
 * @param res Response
 * @param next
 */
export const restoreLanguage = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const ids = req.body?.ids;

  const result = await Database.languageRepository.bulkRestore(ids);
  if (!result) {
    return next(new InternalServerError('language_restore_error'));
  }

  return res.status(StatusCode.OK).send({ message: 'language_restore_success', result });
});
