import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { Conflict, InternalServerError, NotFound } from '../../core/errors';
import { UserJWTPayload } from '../../types/type';
import { Category, User } from '../../database/entity';
import { Translate } from '../../services';

/**
 * Create category
 * @param req Request
 * @param res Response
 * @param next
 */
export const createCategory = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const apiUser: UserJWTPayload = res.locals?.userPayload;
  const createdById: User['id'] = apiUser.userId;
  const parentCategoryId: Category['id'] = req.body.parentCategoryId;
  const subCategoryIds: Category['id'][] = req.body.subCategoryIds;

  const existingCategory = await Database.categoryRepository.getCategoryByName(req.body.name);
  if (existingCategory) {
    return next(new Conflict(await Translate.get(languageCode, 'category_already_exist')));
  }

  const createCategoryPayload: Category = { ...req.body, createdById };
  if (parentCategoryId) {
    const parentCategory: Category = await Database.categoryRepository.findById({ id: parentCategoryId });
    if (!parentCategory) {
      return next(new NotFound(await Translate.get(languageCode, 'parent_category_not_found')));
    }
    createCategoryPayload.parentCategory = parentCategory;
  }
  if (subCategoryIds?.length) {
    const subCategories: Category[] = await Database.categoryRepository.getCategoriesByIds(subCategoryIds);
    if (!subCategories?.length) {
      return next(new NotFound(await Translate.get(languageCode, 'sub_categories_not_found')));
    }
    createCategoryPayload.subCategories = subCategories;
  }
  const result: Category = await Database.categoryRepository.createAndSave(createCategoryPayload);

  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'category_create_error')));
  }

  return res.status(StatusCode.CREATED).send({
    message: await Translate.get(languageCode, 'category_create_success'),
    result,
  });
});
