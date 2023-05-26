import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { Conflict, InternalServerError } from '../../core/errors';
import { UserJWTPayload } from '../../types/type';
import { User } from '../../database/entity';
import { Translate } from '../../services';

/**
 * Create tag
 * @param req Request
 * @param res Response
 * @param next
 */
export const createTag = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const apiUser: UserJWTPayload = res.locals?.userPayload;
  const createdById: User['id'] = apiUser.userId;

  const existingTag = await Database.tagRepository.getTagByName(req.body.name);
  if (existingTag) {
    return next(new Conflict(await Translate.get(languageCode, 'tag_already_exist')));
  }
  const result = await Database.tagRepository.createAndSave({ ...req.body, createdById });

  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'tag_create_error')));
  }

  return res.status(StatusCode.CREATED).send({
    message: await Translate.get(languageCode, 'tag_create_success'),
    result,
  });
});
