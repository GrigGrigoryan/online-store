import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode, UserRole } from '../../types/enum';
import { BadRequest, Forbidden, InternalServerError, NotFound } from '../../core/errors';
import Logger from '../../core/Logger';
import { Translate } from '../../services';
import { Role } from '../../database/entity';

/**
 * Delete role
 * @param req Request
 * @param res Response
 * @param next
 */
export const deleteRole = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const roleId: Role['id'] = req.params.roleId;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const role = await Database.roleRepository.findById({ id: roleId, relations: ['users'] });
  if (!role) {
    return next(new NotFound(await Translate.get(languageCode, 'role_not_found')));
  }

  if (role.name === UserRole.SUPER_ADMIN || role?.users?.length) {
    return next(new Forbidden(await Translate.get(languageCode, 'role_is_already_assigned_to_user')));
  }

  await Database.roleRepository.softRemove(role);

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'role_delete_success'),
  });
});

/**
 * Restore role
 * @param req Request
 * @param res Response
 * @param next
 */
export const restoreRole = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const ids = req.body?.ids;

  const result = await Database.roleRepository.bulkRestore(ids);
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'role_restore_error')));
  }

  return res.status(StatusCode.OK).send({ message: 'role_restore_success', result });
});
