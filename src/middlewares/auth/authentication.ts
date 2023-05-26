import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import jwt from 'jsonwebtoken';
import { envConfig, jwtConfig } from '../../config';
import { BadRequest, Forbidden, Unauthorized } from '../../core/errors';
import { UserJWTPayload } from '../../types/type';
import Logger from '../../core/Logger';
import { Translate } from '../../services';
import { LanguageCode } from '../../types/enum';

export const authentication = async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  let userToken: string = req.headers.authorization;
  const apiKey: string = req.headers['x-api-key'] as string;

  if (apiKey === envConfig.apiKey) {
    return next();
  }
  if (!userToken) {
    return next(new BadRequest(await Translate.get(languageCode, 'token_not_provided')));
  }

  // removing 'Bearer ' from authorization token
  userToken = userToken.slice(7);

  jwt.verify(userToken, jwtConfig.access_secret, (err: Error, decoded: UserJWTPayload) => {
    if (err) {
      Logger.warn(`jwt_token_error: ${JSON.stringify(err)}`);
      return next(new Unauthorized('jwt_token_error'));
    }

    if (!decoded.userId || !decoded.fullName || !decoded.role) {
      return next(new Forbidden('author_data_not_found'));
    }

    res.locals.userPayload = decoded;
    return next();
  });
};
