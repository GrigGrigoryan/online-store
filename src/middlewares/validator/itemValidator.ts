import { Request as Req, Response as Res, NextFunction as Next, Request } from 'express';
import { validateSchema } from './index';
import Joi from 'joi';
import { IItemPayload } from '../../types/interface';
import { LanguageCode } from '../../types/enum';

const itemPayload = async (req: Request): Promise<IItemPayload> => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  return {
    name: Joi.string().trim().min(3),
    description: Joi.string().trim().min(3),
    price: Joi.number().min(0),
    quantity: Joi.number().min(0),
    categoryId: Joi.string().trim().guid().allow(null).optional(),
    tagIds: Joi.array().items(Joi.string().trim().guid().allow(null)).optional(),
  };
};

export const itemCreateValidator = async (req: Req, res: Res, next: Next) => {
  let schema;
  const joiObject = Joi.object(await itemPayload(req)).options({ presence: 'required' });

  if (Array.isArray(req.body)) {
    schema = Joi.array().items(joiObject);
  } else {
    schema = joiObject;
  }

  await validateSchema(req, res, next, schema);
};

export const itemUpdateValidator = async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const itemUpdatePayload = await itemPayload(req);

  const schema = Joi.object({
    ...itemUpdatePayload,
  });

  await validateSchema(req, res, next, schema);
};
