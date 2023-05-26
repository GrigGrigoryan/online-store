import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode, UserRole } from '../../types/enum';
import { Forbidden, NotFound } from '../../core/errors';
import { Role } from '../../database/entity';
import { Translate } from '../../services';
import { UserJWTPayload } from '../../types/type';

/**
 * Get role
 * @param req Request
 * @param res Response
 * @param next
 */
export const getRole = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const roleId: Role['id'] = req.params.roleId;
  const apiUser: UserJWTPayload = res.locals?.userPayload;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const result: Role = (await Database.roleRepository.findById({ id: roleId, relations: ['users'] })) as Role;
  if (!result || (result.name === UserRole.SUPER_ADMIN && apiUser.role?.name !== UserRole.SUPER_ADMIN)) {
    return next(new NotFound(await Translate.get(languageCode, 'role_not_found')));
  }

  return res.status(StatusCode.OK).send({ result });
});
