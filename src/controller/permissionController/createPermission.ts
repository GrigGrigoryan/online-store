import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { InternalServerError, NotFound } from '../../core/errors';
import { Permission, Role, User } from '../../database/entity';
import { Translate } from '../../services';

/**
 * Create permission
 * @param req Request
 * @param res Response
 * @param next
 */
export const createPermission = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const createdById: User['id'] = res.locals?.userPayload?.userId;
  const roleIds: Role['id'][] = req.body.roleIds;

  const existingPermission = await Database.permissionRepository.getPermissionByName(req.body.name);
  if (existingPermission) {
    return res.status(StatusCode.BAD_REQUEST).send({ message: 'permission_name_exist' });
  }

  let result: Permission;
  const createPermissionPayload = { ...req.body, createdById };
  if (roleIds.length) {
    const roles: Role[] = await Database.roleRepository.getRolesByIds(roleIds);
    if (!roles?.length) {
      return next(new NotFound(await Translate.get(languageCode, 'roles_not_found')));
    }

    createPermissionPayload.roles = roles;
  }

  result = await Database.permissionRepository.createAndSave(createPermissionPayload);
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'permission_create_error')));
  }

  return res.status(StatusCode.CREATED).send({
    message: await Translate.get(languageCode, 'permission_create_success'),
    result,
  });
});
