import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { Category } from '../../database/entity';
import { NotFound } from '../../core/errors';
import { Translate } from '../../services';

/**
 * Get category
 * @param req Request
 * @param res Response
 * @param next
 */
export const getCategory = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const categoryId: string = req.params.categoryId;

  const result: Category = await Database.categoryRepository.getCategoryById(categoryId);

  if (!result) {
    return next(new NotFound(await Translate.get(languageCode, 'category_not_found')));
  }

  return res.status(StatusCode.OK).send({ result });
});
