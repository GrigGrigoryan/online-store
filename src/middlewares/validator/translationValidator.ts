import { Request as Req, Response as Res, NextFunction as Next, RequestHandler } from 'express';
import { validateSchema } from './index';
import Joi from 'joi';
import { ITranslationPayload } from '../../types/interface';

const translationPayload: ITranslationPayload = {
  languageId: Joi.string().guid(),
  key: Joi.string().trim().min(3),
  value: Joi.string().trim().min(3),
};

export const translationCreateValidator = async (req: Req, res: Res, next: Next): Promise<any> => {
  let schema;
  if (Array.isArray(req.body)) {
    schema = Joi.array().items(Joi.object(translationPayload).options({ presence: 'required' }));
  } else {
    schema = Joi.object(translationPayload).options({ presence: 'required' });
  }

  await validateSchema(req, res, next, schema);
};

export const translationUpdateValidator = async (req: Req, res: Res, next: Next) => {
  const schema = Joi.object(translationPayload);

  await validateSchema(req, res, next, schema);
};
