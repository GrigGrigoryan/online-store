import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode, UserRole } from '../../types/enum';
import { Forbidden, InternalServerError, NotFound } from '../../core/errors';
import { UserJWTPayload } from '../../types/type';
import { Permission, Role, User } from '../../database/entity';
import { Translate } from '../../services';

/**
 * Update role
 * @param req Request
 * @param res Response
 * @param next
 */
export const updateRole = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const roleId: Role['id'] = req.params.roleId;
  const apiUser: UserJWTPayload = res.locals?.userPayload;
  const updatedById: User['id'] = apiUser.userId;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const permissionIds: Permission['id'][] = req.body.permissionIds;

  const role = await Database.roleRepository.findById({ id: roleId });
  if (!role) {
    return next(new NotFound(await Translate.get(languageCode, 'role_not_found')));
  }

  if (role.name === UserRole.SUPER_ADMIN) {
    return next(new Forbidden(await Translate.get(languageCode, 'role_update_error')));
  }

  const existingRole = await Database.roleRepository.getRoleByName(req.body.name);
  if (existingRole) {
    return res.status(StatusCode.BAD_REQUEST).send({ message: 'role_name_exist' });
  }

  const updateRolePayload: Role = { ...role, ...req.body, updatedById };
  if (permissionIds?.length) {
    const permissions: Permission[] = await Database.permissionRepository.getPermissionsByIds(permissionIds);
    if (!permissions?.length) {
      return next(new NotFound(await Translate.get(languageCode, 'permissions_not_found')));
    }
    updateRolePayload.permissions = permissions;
  }
  const result = await Database.roleRepository.save(updateRolePayload);
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'role_update_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'role_update_success'),
    result,
  });
});
