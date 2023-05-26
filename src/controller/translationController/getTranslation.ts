import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { IQueryBuilder } from '../../types/interface';
import { Translation } from '../../database/entity';
import { NotFound } from '../../core/errors';
import { Translate } from '../../services';

/**
 * Get translation
 * @param req Request
 * @param res Response
 * @param next
 */
export const getTranslation = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const translationId: string = req.params.translationId;

  const result: Translation = await Database.translationRepository.findById({ id: translationId });

  if (!result) {
    return next(new NotFound(await Translate.get(languageCode, 'translation_not_found')));
  }

  return res.status(StatusCode.OK).send({ result });
});
