import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { InternalServerError, NotFound } from '../../core/errors';
import { Base } from '../../database/entity/Base';
import { Permission, Role, Tag, User } from '../../database/entity';
import { Translate } from '../../services';

/**
 * Create role
 * @param req Request
 * @param res Response
 * @param next
 */
export const createRole = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const createdById: User['id'] = res.locals?.userPayload?.userId;
  const permissionIds: Permission['id'][] = req.body.permissionIds;

  const existingRole = await Database.roleRepository.getRoleByName(req.body.name);
  if (existingRole) {
    return res.status(StatusCode.BAD_REQUEST).send({ message: 'role_name_exist' });
  }

  const createRolePayload: Role = { ...req.body, createdById };
  if (permissionIds?.length) {
    const permissions: Permission[] = await Database.permissionRepository.getPermissionsByIds(permissionIds);
    if (!permissions?.length) {
      return next(new NotFound(await Translate.get(languageCode, 'permissions_not_found')));
    }
    createRolePayload.permissions = permissions;
  }
  const result = await Database.roleRepository.createAndSave(createRolePayload);

  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'role_create_error')));
  }

  return res.status(StatusCode.CREATED).send({
    message: await Translate.get(languageCode, 'role_create_success'),
    result,
  });
});
