import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { InternalServerError, NotFound } from '../../core/errors';
import { LanguageCode, StatusCode } from '../../types/enum';
import { Translate } from '../../services';
import { User } from '../../database/entity';

/**
 * Delete user
 * @param req Request
 * @param res Response
 * @param next
 */
export const deleteUser = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const userId: User['id'] = req.params.userId;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const user = await Database.userRepository.findById({ id: userId });
  if (!user) {
    return next(new NotFound(await Translate.get(languageCode, 'user_not_found')));
  }

  await Database.userRepository.softRemove(user);

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, `user_delete_success`),
  });
});

/**
 * Restore user
 * @param req Request
 * @param res Response
 * @param next
 */
export const restoreUser = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const ids: User['id'][] = req.body?.ids;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const result = await Database.userRepository.bulkRestore(ids);
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'user_restore_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'user_restore_success'),
    result,
  });
});
