import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { Tag } from '../../database/entity';
import { NotFound } from '../../core/errors';
import { Translate } from '../../services';

/**
 * Get tag
 * @param req Request
 * @param res Response
 * @param next
 */
export const getTag = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const tagId: string = req.params.tagId;

  const result: Tag = await Database.tagRepository.getTagWithItemsById(tagId);
  if (!result) {
    return next(new NotFound(await Translate.get(languageCode, 'tag_not_found')));
  }

  return res.status(StatusCode.OK).send({ result });
});
