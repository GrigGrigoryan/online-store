import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { StatusCode } from '../../types/enum';
import { IQueryBuilder } from '../../types/interface';
import { Tag } from '../../database/entity';

/**
 * List tags
 * @param req Request
 * @param res Response
 * @param next
 */
export const listTags = asyncHandler(async (req: Req, res: Res, next: Next) => {
  let result: Tag[];
  let count: number;

  if (Object.keys(req.query).length > 0) {
    const query: IQueryBuilder = JSON.parse(JSON.stringify(req.query));

    [result, count] = (await Database.tagRepository.generateQueryBuilder(query)) as [Tag[], number];
  } else {
    result = await Database.tagRepository.findAll();
    count = result?.length;
  }

  if (!result?.length) {
    return res.status(StatusCode.OK).send({ result: [], count: 0 });
  }

  return res.status(StatusCode.OK).send({ result, count });
});
