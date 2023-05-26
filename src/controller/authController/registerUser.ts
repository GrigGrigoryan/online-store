import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler, generateAccessCode } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode, UserRole } from '../../types/enum';
import { v4 as uuidv4 } from 'uuid';
import { BadRequest, InternalServerError, NotFound } from '../../core/errors';
import { Translate } from '../../services';
import { User } from '../../database/entity';
/**
 * Register user
 * @param req Request
 * @param res Response
 * @param next
 */
export const registerUser = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;
  const profilePicture: string = 'profile_icon.png'; /* setting blank profile picture */

  const { firstName, lastName, email, phone, password, gender, birthDate } = req.body;

  const verifyKey: string = generateAccessCode(6);
  const verifyToken: string = uuidv4();

  const existingUser = await Database.userRepository.getUserByEmailOrPhone(false, email, phone);
  if (existingUser) {
    if (!existingUser.verifyKey && !existingUser.verifyToken && existingUser.verifiedAt) {
      return next(new BadRequest(await Translate.get(languageCode, 'user_exist')));
    }

    const updatedVerifyKeyToken = await Database.userRepository.save({ ...existingUser, verifyKey, verifyToken });
    if (!updatedVerifyKeyToken) {
      return next(new InternalServerError(await Translate.get(languageCode, 'user_update_error')));
    }
  } else {
    const role = await Database.roleRepository.getRoleByName(UserRole.CLIENT);
    if (!role) {
      return next(new NotFound(await Translate.get(languageCode, 'role_not_found')));
    }

    const userPayload = {
      profilePicture,
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      birthDate,
      verifyKey,
      verifyToken,
    } as User;

    const user = await Database.userRepository.create(userPayload);

    const result = await Database.userRepository.save({
      ...user,
      role,
    });

    if (!result) {
      return next(new InternalServerError(await Translate.get(languageCode, 'user_create_error')));
    }
  }

  // important
  // verifyKey should never be accessed via response
  // it should be sent via sms or email for verification purpose
  return res.status(StatusCode.OK).send({ verifyKey, verifyToken });
});
