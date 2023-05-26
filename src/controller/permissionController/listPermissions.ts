import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler, generatePermissionsList } from '../../utils';
import { Database } from '../../database';
import { StatusCode } from '../../types/enum';
import { IQueryBuilder } from '../../types/interface';
import { Permission } from '../../database/entity';

/**
 * List permissions
 * @param req Request
 * @param res Response
 * @param next
 */
export const listPermissions = asyncHandler(async (req: Req, res: Res, next: Next) => {
  let result: Permission[];
  let count: number;
  if (Object.keys(req.query).length > 0) {
    const query: IQueryBuilder = JSON.parse(JSON.stringify(req.query));

    [result, count] = (await Database.permissionRepository.generateQueryBuilder(query)) as [Permission[], number];
  } else {
    result = await Database.permissionRepository.findAll();
    count = result?.length;
  }

  if (!result?.length) {
    return res.status(StatusCode.OK).send({ result: [], count: 0 });
  }

  return res.status(StatusCode.OK).send({ result, count });
});

/**
 * List available permissions
 * @param req Request
 * @param res Response
 * @param next
 */
export const listAvailablePermissions = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const result: Permission['name'][] = generatePermissionsList();
  return res.status(StatusCode.OK).send({ result });
});
