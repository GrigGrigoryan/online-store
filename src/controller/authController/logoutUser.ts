import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import { UserJWTPayload } from '../../types/type';
import { Translate } from '../../services';

/**
 * Logout user
 * @param req Request
 * @param res Response
 * @param next
 */
export const logoutUser = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const userPayload: UserJWTPayload = res.locals?.userPayload;

  const refreshToken = await Database.refreshTokenRepository.getRefreshTokenByUserId(userPayload.userId);
  if (!refreshToken) {
    return res.status(StatusCode.OK).send({
      message: await Translate.get(languageCode, 'user_logout_success'),
    });
  }

  await Database.refreshTokenRepository.remove(refreshToken);

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'user_logout_success'),
  });
});
