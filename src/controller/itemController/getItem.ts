import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { Item } from '../../database/entity';
import { BadRequest, NotFound } from '../../core/errors';
import { Translate } from '../../services';

/**
 * Get item
 * @param req Request
 * @param res Response
 * @param next
 */
export const getItem = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const itemId: string = req.params.itemId;

  const result: Item = await Database.itemRepository.getItemById(itemId);
  if (!result) {
    return next(new NotFound(await Translate.get(languageCode, 'item_not_found')));
  }

  return res.status(StatusCode.OK).send({ result });
});
