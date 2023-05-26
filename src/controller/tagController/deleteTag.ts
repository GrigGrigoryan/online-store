import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { BadRequest, InternalServerError, NotFound } from '../../core/errors';
import { Permission, Tag } from '../../database/entity';
import { Translate } from '../../services';
import { getManager } from 'typeorm';

/**
 * Delete tag
 * @param req Request
 * @param res Response
 * @param next
 */
export const deleteTag = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const tagId: string = req.params.tagId;
  let result: Tag;

  const tag: Tag = await Database.tagRepository.findById({ id: tagId });
  if (!tag) {
    return next(new NotFound(await Translate.get(languageCode, 'tag_not_found')));
  }

  await getManager().transaction(async (transactionalEntityManager) => {
    const updatedTag: Tag = await transactionalEntityManager.save(Tag, { ...tag, items: [] });
    result = await transactionalEntityManager.softRemove(Tag, updatedTag);
  });
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'tag_delete_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'tag_delete_success'),
    result,
  });
});

/**
 * Restore tag
 * @param req Request
 * @param res Response
 * @param next
 */
export const restoreTag = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const ids = req.body?.ids;

  const result = await Database.tagRepository.bulkRestore(ids);
  if (!result) {
    return next(new InternalServerError('tag_restore_error'));
  }

  return res.status(StatusCode.OK).send({ message: 'tag_restore_success', result });
});
