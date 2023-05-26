import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { BadRequest, InternalServerError, NotFound } from '../../core/errors';
import { UserJWTPayload } from '../../types/type';
import { Category, Image, Item, Tag, User } from '../../database/entity';
import { Translate } from '../../services';
import { getManager } from 'typeorm';
import { ImageType } from '../../types/enum/ImageType';

/**
 * Update image
 * @param req Request
 * @param res Response
 * @param next
 */
export const updateItem = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const itemId: Item['id'] = req.params.itemId;
  const apiUser: UserJWTPayload = res.locals?.userPayload;
  const updatedById: User['id'] = apiUser.userId;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const tagIds: Tag['id'][] = req.body.tagIds;
  const categoryId: Category['id'] = req.body.categoryId;

  const item = await Database.itemRepository.findById({ id: itemId });
  if (!item) {
    return next(new NotFound(await Translate.get(languageCode, 'item_not_found')));
  }

  const updateItemPayload: Item = { ...item, updatedById, ...req.body };

  if (categoryId) {
    const parentIds = await Database.categoryRepository.getParentsByCategoryId(categoryId);
    if (!parentIds?.length) {
      return next(new NotFound(await Translate.get(languageCode, 'parent_categories_not_found')));
    }
    updateItemPayload.categories = parentIds.map((el) => {
      return { id: el } as Category;
    });
  }
  if (tagIds?.length) {
    const tags: Tag[] = await Database.tagRepository.getTagsByIds(tagIds);
    if (!tags?.length) {
      return next(new NotFound(await Translate.get(languageCode, 'tags_not_found')));
    }

    updateItemPayload.tags = tags;
  }
  const result = await Database.itemRepository.save(updateItemPayload);
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'item_update_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'item_update_success'),
    result,
  });
});

/**
 * Upload item image
 * @param req Request
 * @param res Response
 * @param next
 */
export const uploadItemImage = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const apiUser: UserJWTPayload = res.locals?.userPayload;
  const createdById: User['id'] = apiUser.userId;
  const updatedById: User['id'] = createdById;
  const itemId: Item['id'] = req.params.itemId;

  if (!req.file?.filename) {
    return next(new BadRequest(await Translate.get(languageCode, 'item_image_required')));
  }

  const itemImageUrl: Image['url'] = req.file?.path?.slice(7) || '';
  const item = await Database.itemRepository.getItemWithImages(itemId);
  if (!item) {
    return next(new NotFound(await Translate.get(languageCode, 'item_not_found')));
  }

  let result: Item;
  await getManager().transaction(async (transactionalEntityManager) => {
    const newImage: Image = await new Image();
    newImage.items = [item];
    newImage.url = itemImageUrl;
    newImage.createdById = createdById;
    newImage.type = ImageType.ITEM;

    const image: Image = await transactionalEntityManager.save(Image, newImage);
    result = await transactionalEntityManager.save(Item, {
      ...item,
      updatedById,
      images: [...item.images, { id: image.id }],
    });
  });
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'item_image_upload_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'item_image_upload_success'),
    result,
  });
});
