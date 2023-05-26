import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { BadRequest, Forbidden, InternalServerError, NotFound } from '../../core/errors';
import { Translate } from '../../services';
import { Category, Permission } from '../../database/entity';
import { getManager } from 'typeorm';

/**
 * Delete permission
 * @param req Request
 * @param res Response
 * @param next
 */
export const deletePermission = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const permissionId: Permission['id'] = req.params.permissionId;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  let result: Permission;

  const permission = await Database.permissionRepository.findById({ id: permissionId, relations: ['users'] });
  if (!permission) {
    return next(new NotFound(await Translate.get(languageCode, 'permission_not_found')));
  }
  await getManager().transaction(async (transactionalEntityManager) => {
    const updatedPermission: Permission = await transactionalEntityManager.save(Permission, { ...permission, roles: [] });
    result = await transactionalEntityManager.softRemove(Permission, updatedPermission);
  });
  if (!result) {
    return next(new BadRequest(await Translate.get(languageCode, 'permission_delete_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'permission_delete_success'),
    result,
  });
});

/**
 * Restore permission
 * @param req Request
 * @param res Response
 * @param next
 */
export const restorePermission = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const ids = req.body?.ids;

  const result = await Database.permissionRepository.bulkRestore(ids);
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'permission_restore_error')));
  }

  return res.status(StatusCode.OK).send({ message: 'permission_restore_success', result });
});
