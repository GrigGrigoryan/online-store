import { NextFunction as Next, Request as Req, Response as Res } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { StatusCode } from '../../types/enum';
import { Category } from '../../database/entity';

/**
 * List categories
 * @param req Request
 * @param res Response
 * @param next
 */
export const listCategories = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const result: Category[] = await Database.categoryRepository.getCategoriesTree();
  if (!result?.length) {
    return res.status(StatusCode.OK).send({ result: [] });
  }

  return res.status(StatusCode.OK).send({ result });
});
