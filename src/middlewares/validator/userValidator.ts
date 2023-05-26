import { Request as Req, Response as Res, NextFunction as Next, Request } from 'express';
import { validateSchema } from './index';
import Joi from 'joi';
import { IUserPayload } from '../../types/interface';
import { LanguageCode, NotificationOption, UserGender } from '../../types/enum';
import { Translate } from '../../services';

const userPayload = async (req: Request): Promise<IUserPayload> => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  return {
    firstName: Joi.string()
      .trim()
      .min(3)
      .max(30)
      .messages({
        'string.min': await Translate.get(languageCode, 'firstname_must_be_minimum_3_characters'),
        'string.max': await Translate.get(languageCode, 'firstname_must_be_maximum_30_characters'),
        'string.empty': await Translate.get(languageCode, 'firstname_is_required'),
      }),
    lastName: Joi.string()
      .trim()
      .min(5)
      .max(30)
      .messages({
        'string.min': await Translate.get(languageCode, 'lastname_must_be_minimum_5_characters'),
        'string.max': await Translate.get(languageCode, 'lastname_must_be_maximum_30_characters'),
        'string.empty': await Translate.get(languageCode, 'lastname_is_required'),
      }),
    email: Joi.string()
      .trim()
      .min(3)
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru', 'am', 'info', 'org', 'eu'] } })
      .optional()
      .messages({
        'string.email': await Translate.get(languageCode, 'not_a_valid_email_address'),
        'string.empty': await Translate.get(languageCode, 'email_cannot_be_empty'),
      }),
    phone: Joi.string()
      .trim()
      .min(12)
      .max(12)
      .pattern(/^\+374\d+$/)
      .messages({
        'string.min': await Translate.get(languageCode, 'phone_number_must_be_minimum_12_characters'),
        'string.max': await Translate.get(languageCode, 'phone_number_must_be_maximum_12_characters'),
        'string.pattern.base': await Translate.get(languageCode, 'not_valid_phone_number'),
        'string.empty': await Translate.get(languageCode, 'phone_number_cannot_be_empty'),
      }),
    gender: Joi.string()
      .valid(UserGender.MALE, UserGender.FEMALE, UserGender.OTHER)
      .allow(null)
      .allow('')
      .pattern(/^[a-z]+$/)
      .messages({
        'any.only': await Translate.get(languageCode, 'invalid_gender'),
        'string.pattern.base': await Translate.get(languageCode, 'gender_can_contain_only_lowercase_characters'),
      }),
    birthDate: Joi.date()
      .max(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18)
      .allow(null)
      .allow('')
      .optional()
      .messages({
        'date.max': await Translate.get(languageCode, 'age_must_be_18+'),
      }),
    blockedAt: Joi.date().allow(null).allow('').optional(),
    rating: Joi.string().trim().min(3).allow(null).allow('').optional(),
    signature: Joi.string().trim().allow(null).allow('').optional(),
    roleId: Joi.string().guid().optional(),
    password: Joi.string().trim().min(8).allow(null).allow('').optional(),
  };
};

export const userRegisterValidator = async (req: Req, res: Res, next: Next) => {
  let schema;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const joiObject = Joi.object({
    ...(await userPayload(req)),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\\$&*~]).{8,}$'))
      .messages({
        'string.min': await Translate.get(languageCode, 'password_must_be_minimum_8_characters'),
        'string.pattern.base': await Translate.get(languageCode, 'password_must_contain_different_characters'),
        'string.empty': await Translate.get(languageCode, 'password_cannot_be_empty'),
      }),
    verifyType: Joi.string()
      .min(3)
      .valid(NotificationOption.EMAIL, NotificationOption.SMS, NotificationOption.AUTO)
      .messages({
        'any.only': await Translate.get(languageCode, 'invalid_verify_type'),
      }),
    verifiedAt: Joi.date().allow(null).allow('').optional(),
  }).options({ presence: 'required' });

  if (Array.isArray(req.body)) {
    schema = Joi.array().items(joiObject);
  } else {
    schema = joiObject;
  }

  await validateSchema(req, res, next, schema);
};

export const userCreateValidator = async (req: Req, res: Res, next: Next) => {
  let schema;
  const joiObject = Joi.object(await userPayload(req)).options({ presence: 'required' });

  if (Array.isArray(req.body)) {
    schema = Joi.array().items(joiObject);
  } else {
    schema = joiObject;
  }

  await validateSchema(req, res, next, schema);
};

export const userUpdateValidator = async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const userUpdatePayload = await userPayload(req);
  delete userUpdatePayload.email;
  delete userUpdatePayload.phone;

  const schema = Joi.object({
    ...userUpdatePayload,
    verifyType: Joi.string()
      .min(3)
      .valid(NotificationOption.EMAIL, NotificationOption.SMS, NotificationOption.AUTO)
      .messages({
        'any.only': await Translate.get(languageCode, 'invalid_verify_type'),
      })
      .allow(null)
      .allow('')
      .optional(),
    verifiedAt: Joi.date().allow(null).allow('').optional(),
  });

  await validateSchema(req, res, next, schema);
};
