import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { validateSchema } from './index';
import Joi from 'joi';
import { ILanguagePayload } from '../../types/interface';

const languagePayload: ILanguagePayload = {
  code: Joi.string().trim().min(3).max(10),
  shortCode: Joi.string().trim().min(3).max(10),
  label: Joi.string().trim().min(3),
  isDefault: Joi.boolean().default(false),
};

export const languageCreateValidator = async (req: Req, res: Res, next: Next) => {
  let schema;
  if (Array.isArray(req.body)) {
    schema = Joi.array().items(Joi.object(languagePayload).options({ presence: 'required' }));
  } else {
    schema = Joi.object(languagePayload).options({ presence: 'required' });
  }

  await validateSchema(req, res, next, schema);
};

export const languageUpdateValidator = async (req: Req, res: Res, next: Next) => {
  const schema = Joi.object(languagePayload);

  await validateSchema(req, res, next, schema);
};
