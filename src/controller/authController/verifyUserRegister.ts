import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { InternalServerError, NotFound, Unauthorized } from '../../core/errors';
import { LanguageCode, StatusCode, UserRole } from '../../types/enum';
import { UserJWTPayload } from '../../types/type';
import jwt from 'jsonwebtoken';
import { jwtConfig, tokenLifetimeConfig } from '../../config';
import { Translate } from '../../services';

/**
 * Verify user register
 * @param req Request
 * @param res Response
 * @param next
 */
export const verifyUserRegister = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const { verifyToken, verifyKey, deviceId } = req.body;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const user = await Database.userRepository.getVerifyKeyWithRefreshTokensByToken(verifyToken);
  if (!user) {
    return next(new NotFound(await Translate.get(languageCode, 'user_not_found')));
  }

  if (!verifyKey || !verifyToken || verifyKey !== user.verifyKey || verifyToken !== user.verifyToken) {
    return next(new Unauthorized(await Translate.get(languageCode, 'invalid_verify_credentials')));
  }

  const jwtPayload: UserJWTPayload = await user.getUserJWTPayload(UserRole.CLIENT);
  const accessToken = jwt.sign(jwtPayload, jwtConfig.access_secret, { expiresIn: tokenLifetimeConfig.accessToken.short });

  const refreshKey: string = jwt.sign({ accessToken }, jwtConfig.refresh_secret, { expiresIn: tokenLifetimeConfig.refreshToken });
  const lastUsedAt = new Date();

  const refreshTokenData = {
    deviceId,
    refreshKey,
    lastUsedAt,
  };

  const refreshToken = await Database.refreshTokenRepository.createAndSave(refreshTokenData);
  if (!refreshToken) {
    return next(new InternalServerError(await Translate.get(languageCode, 'token_create_error')));
  }

  const result = await Database.userRepository.save({
    ...user,
    refreshTokens: [refreshToken],
    verifyKey: null,
    verifyToken: null,
    verifiedAt: new Date(),
  });

  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'user_verify_key_token_update_error')));
  }

  return res.status(StatusCode.CREATED).send({
    message: await Translate.get(languageCode, 'user_register_success'),
    result: { accessToken, refreshKey },
  });
});
