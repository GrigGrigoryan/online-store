import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { StatusCode } from '../../types/enum';
import { IQueryBuilder } from '../../types/interface';
import { Item } from '../../database/entity';

/**
 * List items
 * @param req Request
 * @param res Response
 * @param next
 */
export const listItems = asyncHandler(async (req: Req, res: Res, next: Next) => {
  let result: Item[];
  let count: number;

  if (req.query.q) {
    [result, count] = (await Database.itemRepository.searchItemsByQuery(req.query)) as [Item[], number];
  } else {
    result = await Database.itemRepository.findAll();
    count = result?.length;
  }

  if (!result?.length) {
    return res.status(StatusCode.OK).send({ result: [], count: 0 });
  }

  return res.status(StatusCode.OK).send({ result, count });
});
