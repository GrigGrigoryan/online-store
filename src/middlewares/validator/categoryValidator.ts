import { Request as Req, Response as Res, NextFunction as Next, Request } from 'express';
import { validateSchema } from './index';
import Joi from 'joi';
import { ICategoryPayload } from '../../types/interface';
import { LanguageCode } from '../../types/enum';

const categoryPayload = async (req: Request): Promise<ICategoryPayload> => {
  return {
    name: Joi.string().trim().min(3),
    description: Joi.string().trim().min(3),
    parentCategoryId: Joi.string().trim().guid().allow(null).optional(),
    subCategoryIds: Joi.array().items(Joi.string().trim().guid().allow(null)).optional(),
    isPublic: Joi.boolean(),
  };
};

export const categoryCreateValidator = async (req: Req, res: Res, next: Next) => {
  let schema;
  const joiObject = Joi.object(await categoryPayload(req)).options({ presence: 'required' });

  if (Array.isArray(req.body)) {
    schema = Joi.array().items(joiObject);
  } else {
    schema = joiObject;
  }

  await validateSchema(req, res, next, schema);
};

export const categoryUpdateValidator = async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const categoryUpdatePayload = await categoryPayload(req);

  const schema = Joi.object({
    ...categoryUpdatePayload,
  });

  await validateSchema(req, res, next, schema);
};
