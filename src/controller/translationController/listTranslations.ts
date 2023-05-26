import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { StatusCode } from '../../types/enum';
import { IQueryBuilder } from '../../types/interface';
import { Translation } from '../../database/entity';

/**
 * List translations
 * @param req Request
 * @param res Response
 * @param next
 */
export const listTranslations = asyncHandler(async (req: Req, res: Res, next: Next) => {
  let count: number;
  const languageCode = req.query.language_code as string;
  const hashed = req.query.hashed === 'true';

  let result: Translation[];
  if (languageCode) {
    result = await Database.translationRepository.getTranslationsByLanguageCode(languageCode, null);
  } else if (Object.keys(req.query).length > 0) {
    const query: IQueryBuilder = JSON.parse(JSON.stringify(req.query));
    [result, count] = (await Database.translationRepository.generateQueryBuilder(query)) as [Translation[], number];
  }

  if (!result?.length) {
    return res.status(StatusCode.OK).send({ result: [], count: 0 });
  }

  if (hashed) {
    result = prepareHashedData(result);
  }

  return res.status(StatusCode.OK).send({ result, count });
});

const prepareHashedData = (translations: Translation[]): any => {
  const result: any = {};
  for (const translation of translations) {
    result[translation.key] = translation.value;
  }
  return result;
};
