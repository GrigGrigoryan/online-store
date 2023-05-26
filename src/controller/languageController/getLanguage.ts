import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { Language } from '../../database/entity';
import { NotFound } from '../../core/errors';
import { Translate } from '../../services';

/**
 * Get language
 * @param req Request
 * @param res Response
 * @param next
 */
export const getLanguage = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const languageId: string = req.params.languageId;
  const withTranslations: boolean = req.query.with_translations === 'true';

  let result: Language;
  if (withTranslations) {
    result = await Database.languageRepository.getLanguageWithTranslations(languageId);
  } else {
    result = await Database.languageRepository.findById({ id: languageId });
  }

  if (!result) {
    return next(new NotFound(await Translate.get(languageCode, 'language_not_found')));
  }

  return res.status(StatusCode.OK).send({ result });
});
