import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode } from '../../types/enum';
import jwt from 'jsonwebtoken';
import { jwtConfig, tokenLifetimeConfig } from '../../config';
import { InternalServerError, Unauthorized } from '../../core/errors';
import { UserJWTPayload } from '../../types/type';
import { Translate } from '../../services';
import { RefreshToken, User } from '../../database/entity';

/**
 * Login user
 * @param req Request
 * @param res Response
 * @param next
 */
export const loginUser = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const { username, password } = req.body;
  const { deviceId, rememberMe } = req.body;
  const languageCode: LanguageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const user: User = await Database.userRepository.getUserByEmailOrPhone(true, username);
  if (!user) {
    return next(new Unauthorized(await Translate.get(languageCode, 'invalid_credentials')));
  }

  if (user.password !== password) {
    return next(new Unauthorized(await Translate.get(languageCode, 'invalid_credentials')));
  }

  if (!user.verifiedAt) {
    // todo redirect into verification
    return next(new Unauthorized(await Translate.get(languageCode, 'verify_phone_email')));
  }

  const jwtPayload: UserJWTPayload = await user.getUserJWTPayload(user.role.name);

  const accessToken = jwt.sign(jwtPayload, jwtConfig.access_secret, { expiresIn: tokenLifetimeConfig.accessToken.short });

  const refreshKey: string = jwt.sign({ accessToken }, jwtConfig.refresh_secret, { expiresIn: tokenLifetimeConfig.refreshToken });
  const lastUsedAt: Date = new Date();

  const refreshTokenData = {
    user,
    deviceId,
    refreshKey,
    lastUsedAt,
    rememberMe,
  } as RefreshToken;

  const existingRefreshToken = await Database.refreshTokenRepository.getRefreshTokenByUserIdDeviceId(user.id, deviceId);

  let result: User;
  if (!existingRefreshToken) {
    result = await Database.refreshTokenRepository.createAndSave(refreshTokenData);

    if (!result) {
      return next(new InternalServerError(await Translate.get(languageCode, 'refresh_token_create_error')));
    }
  } else {
    result = await Database.refreshTokenRepository.save({ ...existingRefreshToken, ...refreshTokenData });

    if (!result) {
      return next(new InternalServerError(await Translate.get(languageCode, 'refresh_token_update_error')));
    }
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'user_login_success'),
    result: {
      accessToken,
      refreshKey,
    },
  });
});
