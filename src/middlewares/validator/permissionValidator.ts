import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { validateSchema } from './index';
import Joi from 'joi';
import { IPermissionPayload } from '../../types/interface';
import { generatePermissionsList } from '../../utils';

const permissionPayload: IPermissionPayload = {
  name: Joi.string()
    .trim()
    .valid(...generatePermissionsList()),
  roleIds: Joi.array().items(Joi.string().trim().guid().allow(null)).optional(),
};

export const permissionCreateValidator = async (req: Req, res: Res, next: Next) => {
  let schema;
  if (Array.isArray(req.body)) {
    schema = Joi.array().items(Joi.object(permissionPayload).options({ presence: 'required' }));
  } else {
    schema = Joi.object(permissionPayload).options({ presence: 'required' });
  }

  await validateSchema(req, res, next, schema);
};

export const permissionUpdateValidator = async (req: Req, res: Res, next: Next) => {
  const schema = Joi.object(permissionPayload);

  await validateSchema(req, res, next, schema);
};
