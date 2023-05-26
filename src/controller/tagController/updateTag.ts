import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { Conflict, InternalServerError, NotFound } from '../../core/errors';
import { UserJWTPayload } from '../../types/type';
import { Category, User } from '../../database/entity';
import { Translate } from '../../services';

/**
 * Update tag
 * @param req Request
 * @param res Response
 * @param next
 */
export const updateTag = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const tagId: Category['id'] = req.params.tagId;
  const apiUser: UserJWTPayload = res.locals?.userPayload;
  const updatedById: User['id'] = apiUser.userId;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const tag = await Database.tagRepository.findById({ id: tagId });
  if (!tag) {
    return next(new NotFound(await Translate.get(languageCode, 'tag_not_found')));
  }

  const existingTag = await Database.tagRepository.getTagByName(req.body.name);
  if (existingTag) {
    return next(new Conflict(await Translate.get(languageCode, 'tag_already_exist')));
  }

  const result = await Database.tagRepository.save({ ...tag, updatedById, ...req.body });
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'tag_update_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'tag_update_success'),
    result,
  });
});
