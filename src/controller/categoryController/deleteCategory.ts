import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { BadRequest, InternalServerError, NotFound } from '../../core/errors';
import { Category, Item } from '../../database/entity';
import { Translate } from '../../services';
import { getManager } from 'typeorm';

/**
 * Delete category
 * @param req Request
 * @param res Response
 * @param next
 */
export const deleteCategory = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const categoryId: string = req.params.categoryId;
  let result: Category;

  const category: Category = await Database.categoryRepository.findById({ id: categoryId });
  if (!category) {
    return next(new NotFound(await Translate.get(languageCode, 'category_not_found')));
  }

  await getManager().transaction(async (transactionalEntityManager) => {
    const updatedCategory: Category = await transactionalEntityManager.save(Category, { ...category, subCategories: [] });
    result = await transactionalEntityManager.softRemove(Category, updatedCategory);
  });
  if (!result) {
    return next(new BadRequest(await Translate.get(languageCode, 'category_delete_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'category_delete_success'),
    result,
  });
});

/**
 * Restore category
 * @param req Request
 * @param res Response
 * @param next
 */
export const restoreCategory = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const ids = req.body?.ids;

  const result = await Database.categoryRepository.bulkRestore(ids);
  if (!result) {
    return next(new InternalServerError('category_restore_error'));
  }

  return res.status(StatusCode.OK).send({ message: 'category_restore_success', result });
});
