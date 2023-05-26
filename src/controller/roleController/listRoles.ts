import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { StatusCode, UserRole } from '../../types/enum';
import { IQueryBuilder } from '../../types/interface';
import { Role } from '../../database/entity';

/**
 * List roles
 * @param req Request
 * @param res Response
 * @param next
 */
export const listRoles = asyncHandler(async (req: Req, res: Res, next: Next) => {
  let result: Role[];
  let count: number;
  if (Object.keys(req.query).length > 0) {
    const query: IQueryBuilder = JSON.parse(JSON.stringify(req.query));

    [result, count] = (await Database.roleRepository.generateQueryBuilder(query)) as [Role[], number];
  } else {
    result = await Database.roleRepository.findAll();
    count = result?.length;
  }

  if (!result?.length) {
    return res.status(StatusCode.OK).send({ result: [], count: 0 });
  }

  const foundIndex = result.findIndex((role: Role) => role.name === UserRole.SUPER_ADMIN);
  if (foundIndex > -1) {
    result.splice(foundIndex, 1);
    count--;
  }

  return res.status(StatusCode.OK).send({ result, count });
});
