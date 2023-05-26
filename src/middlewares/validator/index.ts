import { NextFunction as Next, Request as Req, RequestHandler, Response as Res } from 'express';
import { LanguageCode, StatusCode } from '../../types/enum';
import { Translate } from '../../services';
import { BadRequest } from '../../core/errors';

export * from './userValidator';
export * from './languageValidator';
export * from './translationValidator';
export * from './roleValidator';
export * from './permissionValidator';
export * from './categoryValidator';
export * from './itemValidator';
export * from './tagValidator';

export const validateSchema = async (req: Req, res: Res, next: Next, schema: any) => {
  // schema options
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const { error, value } = schema.validate(req.body, options);

  if (error) {
    const result = error.details.map(async (x: { path: string[]; message: string }) => {
      const translatedMessage: string = await Translate.get(languageCode, x.message);
      return { field: x.path[0], message: translatedMessage };
    });

    await Promise.all(result).then((errors: Awaited<Error>[]) => {
      next(new BadRequest('validation_error', JSON.stringify(errors)));
    });
  } else {
    // on success replace req.body with validated value and trigger next middleware function
    req.body = value;
    next();
  }
};
