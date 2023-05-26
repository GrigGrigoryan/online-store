import { Request as Req, Response as Res, NextFunction as Next, Request } from 'express';
import { validateSchema } from './index';
import Joi from 'joi';
import { ITagPayload } from '../../types/interface';
import { LanguageCode } from '../../types/enum';

const tagPayload = async (req: Request): Promise<ITagPayload> => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  return {
    name: Joi.string().trim().min(3),
  };
};

export const tagCreateValidator = async (req: Req, res: Res, next: Next) => {
  let schema;
  const joiObject = Joi.object(await tagPayload(req)).options({ presence: 'required' });

  if (Array.isArray(req.body)) {
    schema = Joi.array().items(joiObject);
  } else {
    schema = joiObject;
  }

  await validateSchema(req, res, next, schema);
};

export const tagUpdateValidator = async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const tagUpdatePayload = await tagPayload(req);

  const schema = Joi.object({
    ...tagUpdatePayload,
  });

  await validateSchema(req, res, next, schema);
};
