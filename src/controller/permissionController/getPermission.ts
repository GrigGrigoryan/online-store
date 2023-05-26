import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { Permission } from '../../database/entity';
import { UserJWTPayload } from '../../types/type';
import { NotFound } from '../../core/errors';
import { Translate } from '../../services';

/**
 * Get permission
 * @param req Request
 * @param res Response
 * @param next
 */
export const getPermission = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const permissionId: Permission['id'] = req.params.permissionId;
  const apiUser: UserJWTPayload = res.locals?.userPayload;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const result: Permission = (await Database.permissionRepository.findById({ id: permissionId, relations: ['roles'] })) as Permission;
  if (!result) {
    return next(new NotFound(await Translate.get(languageCode, 'permission_not_found')));
  }
  return res.status(StatusCode.OK).send({ result });
});
