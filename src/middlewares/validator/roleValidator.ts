import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { validateSchema } from './index';
import Joi from 'joi';
import { IRolePayload } from '../../types/interface';

const rolePayload: IRolePayload = {
  name: Joi.string().trim().min(3),
  permissionIds: Joi.array().items(Joi.string().trim()).optional(),
};

export const roleCreateValidator = async (req: Req, res: Res, next: Next) => {
  let schema;
  if (Array.isArray(req.body)) {
    schema = Joi.array().items(Joi.object(rolePayload).options({ presence: 'required' }));
  } else {
    schema = Joi.object(rolePayload).options({ presence: 'required' });
  }

  await validateSchema(req, res, next, schema);
};

export const roleUpdateValidator = async (req: Req, res: Res, next: Next) => {
  const schema = Joi.object(rolePayload);

  await validateSchema(req, res, next, schema);
};
