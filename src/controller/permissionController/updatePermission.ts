import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { Forbidden, InternalServerError, NotFound } from '../../core/errors';
import { UserJWTPayload } from '../../types/type';
import { Permission, Role, User } from '../../database/entity';
import { Translate } from '../../services';

/**
 * Update permission
 * @param req Request
 * @param res Response
 * @param next
 */
export const updatePermission = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const permissionId: Permission['id'] = req.params.permissionId;
  const apiUser: UserJWTPayload = res.locals?.userPayload;
  const updatedById: User['id'] = apiUser.userId;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const roleIds: Role['id'][] = req.body.roleIds;

  const permission = await Database.permissionRepository.findById({ id: permissionId });
  if (!permission) {
    return next(new NotFound(await Translate.get(languageCode, 'permission_not_found')));
  }

  const existingPermission = await Database.permissionRepository.getPermissionByName(req.body.name);
  if (existingPermission) {
    return res.status(StatusCode.BAD_REQUEST).send({ message: 'permission_name_exist' });
  }

  const updatePermissionPayload: Permission = { ...permission, updatedById, ...req.body };
  if (roleIds.length) {
    const roles: Role[] = await Database.roleRepository.getRolesByIds(roleIds);
    if (!roles?.length) {
      return next(new NotFound(await Translate.get(languageCode, 'roles_not_found')));
    }

    updatePermissionPayload.roles = roles;
  }

  const result = await Database.permissionRepository.save(updatePermissionPayload);
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'permission_update_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'permission_update_success'),
    result,
  });
});
