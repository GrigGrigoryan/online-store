import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler, getParentIdsById } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { InternalServerError, NotFound } from '../../core/errors';
import { UserJWTPayload } from '../../types/type';
import { Category, Item, Tag, User } from '../../database/entity';
import { Translate } from '../../services';

/**
 * Create item
 * @param req Request
 * @param res Response
 * @param next
 */
export const createItem = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const apiUser: UserJWTPayload = res.locals?.userPayload;
  const createdById: User['id'] = apiUser.userId;
  const categoryId: Category['id'] = req.body.categoryId;
  const tagIds: Tag['id'][] = req.body.tagIds;

  const createItemPayload: Item = {
    ...req.body,
    user: { id: createdById },
    createdById,
  };

  if (categoryId) {
    const parentIds = await Database.categoryRepository.getParentsByCategoryId(categoryId);
    if (!parentIds?.length) {
      return next(new NotFound(await Translate.get(languageCode, 'parent_categories_not_found')));
    }
    createItemPayload.categories = parentIds.map((el) => {
      return { id: el } as Category;
    });
  }
  if (tagIds?.length) {
    const tags = await Database.tagRepository.getTagsByIds(tagIds);
    if (tags?.length) {
      return next(new NotFound(await Translate.get(languageCode, 'tags_not_found')));
    }
    createItemPayload.tags = tags;
  }
  const result = await Database.itemRepository.createAndSave(createItemPayload);
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'item_create_error')));
  }

  return res.status(StatusCode.CREATED).send({
    message: await Translate.get(languageCode, 'item_create_success'),
    result,
  });
});
