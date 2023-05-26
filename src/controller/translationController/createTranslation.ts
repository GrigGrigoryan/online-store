import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { Conflict, InternalServerError } from '../../core/errors';
import { UserJWTPayload } from '../../types/type';
import { Translate } from '../../services';
import { User } from '../../database/entity';

/**
 * Create translation
 * @param req Request
 * @param res Response
 * @param next
 */
export const createTranslation = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const apiUser: UserJWTPayload = res.locals?.userPayload;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  req.body.createdById = apiUser.userId as User['id'];

  const existingTranslation = await Database.translationRepository.getTranslationByKey(req.body.key);
  if (existingTranslation) {
    return next(new Conflict(await Translate.get(languageCode, 'translation_already_exists')));
  }

  const result = await Database.translationRepository.createAndSave(req.body);

  let languages = await Database.languageRepository.findAll();
  languages = languages?.filter((l) => l.id !== req.body.languageId);

  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'translation_create_error')));
  }

  for (const language of languages) {
    const translation = await Database.translationRepository.create({ languageId: language.id, key: req.body.key, value: '' });
    await Database.translationRepository.save(translation);
  }

  await Translate.instance.init();

  return res.status(StatusCode.CREATED).send({
    message: await Translate.get(languageCode, 'translation_create_success'),
    result,
  });
});
