import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { StatusCode } from '../../types/enum';
import { IQueryBuilder } from '../../types/interface';
import { User } from '../../database/entity';

/**
 * List users
 * @param req Request
 * @param res Response
 * @param next
 */
export const listUsers = asyncHandler(async (req: Req, res: Res, next: Next) => {
  let result: User[];
  let count: number;
  if (Object.keys(req.query).length > 0) {
    const query: IQueryBuilder = JSON.parse(JSON.stringify(req.query));

    [result, count] = (await Database.userRepository.generateQueryBuilder(query)) as [User[], number];
  } else {
    result = await Database.userRepository.findAll();
    count = result?.length;
  }

  if (!result?.length) {
    return res.status(StatusCode.OK).send({ result: [], count: 0 });
  }

  return res.status(StatusCode.OK).send({ result, count });
});
