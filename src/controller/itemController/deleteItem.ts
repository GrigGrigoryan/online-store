import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { InternalServerError, NotFound } from '../../core/errors';
import { Item } from '../../database/entity';
import { Translate } from '../../services';
import { getManager } from 'typeorm';

/**
 * Delete item
 * @param req Request
 * @param res Response
 * @param next
 */
export const deleteItem = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const itemId: string = req.params.itemId;
  let result: Item;

  const item: Item = await Database.itemRepository.findById({ id: itemId });
  if (!item) {
    return next(new NotFound(await Translate.get(languageCode, 'item_not_found')));
  }
  await getManager().transaction(async (transactionalEntityManager) => {
    const updatedItem: Item = await transactionalEntityManager.save(Item, { ...item, tags: [], categories: [] });
    result = await transactionalEntityManager.softRemove(Item, updatedItem);
  });
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'item_delete_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'item_delete_success'),
    result,
  });
});

/**
 * Restore item
 * @param req Request
 * @param res Response
 * @param next
 */
export const restoreItem = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const ids = req.body?.ids;

  const result = await Database.itemRepository.bulkRestore(ids);
  if (!result) {
    return next(new InternalServerError('item_restore_error'));
  }

  return res.status(StatusCode.OK).send({ message: 'item_restore_success', result });
});
