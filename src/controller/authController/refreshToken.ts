import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import jwt from 'jsonwebtoken';
import { jwtConfig, tokenLifetimeConfig } from '../../config';
import { InternalServerError, Unauthorized } from '../../core/errors';
import { UserJWTPayload } from '../../types/type';
import { Translate } from '../../services';
import { RefreshToken } from '../../database/entity';

/**
 * Refresh token
 * @param req Request
 * @param res Response
 * @param next
 */
export const refreshToken = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const refreshKey: string = req.params.refreshKey;

  const user = await Database.userRepository.getUserWithRefreshTokenAndRoleByKey(refreshKey);
  if (!user?.refreshTokens?.length) {
    return next(new Unauthorized(await Translate.get(languageCode, 'unauthorized')));
  }

  const userRefreshToken: RefreshToken = user.refreshTokens[0];
  const isTimeExpired: boolean =
    new Date(userRefreshToken.lastUsedAt).getTime() + tokenLifetimeConfig.accessToken.short * 1000 < new Date().getTime();

  if (user.blockedAt || (isTimeExpired && !userRefreshToken.rememberMe)) {
    const refreshTokenDeleted = await Database.refreshTokenRepository.remove(refreshToken);

    if (!refreshTokenDeleted) {
      return next(new InternalServerError(await Translate.get(languageCode, 'refresh_token_delete_error')));
    }

    const message = user.blockedAt ? 'user_deactivated' : 'session_expired';

    return next(new Unauthorized(await Translate.get(languageCode, message)));
  } else {
    const updatedRefreshToken = await Database.refreshTokenRepository.save({ ...userRefreshToken, lastUsedAt: new Date() });

    if (!updatedRefreshToken) {
      return next(new InternalServerError(await Translate.get(languageCode, 'refresh_token_update_error')));
    }

    const newJwtPayload: UserJWTPayload = await user.getUserJWTPayload(user.role.name);

    const newJwtToken = jwt.sign(newJwtPayload, jwtConfig.access_secret, { expiresIn: tokenLifetimeConfig.accessToken.short });

    return res.status(StatusCode.OK).send({ newJwtToken });
  }
});
