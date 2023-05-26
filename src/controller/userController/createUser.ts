import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { asyncHandler, generateAccessCode } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, StatusCode, UserRole, NotificationOption } from '../../types/enum';
import { Conflict, InternalServerError, NotFound } from '../../core/errors';
import { Image, Role, User } from '../../database/entity';
import { v4 as uuidv4 } from 'uuid';
import { Translate } from '../../services';
import { UserJWTPayload } from '../../types/type';
import { generatePassword } from '../../utils/generatePassword';

/**
 * Create user
 * @param req Request
 * @param res Response
 * @param next
 */
export const createUser = asyncHandler(async (req: Req, res: Res, next: Next) => {
  let result: User;
  const apiUser: UserJWTPayload = res.locals?.userPayload;
  let verifyKey: User['verifyKey'] = generateAccessCode(6);
  let verifyToken: User['verifyToken'] = uuidv4();
  let verifiedAt: User['verifiedAt'];
  const profilePicture: string = 'profile_icon.png'; /* setting blank profile picture */
  const createdById: User['id'] = apiUser.userId;
  const verifiedById: User['id'] = apiUser.userId;
  const roleId: Role['id'] = req.body.roleId;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const existingUser: User = await Database.userRepository.getUserByEmailOrPhone(false, req.body.email, req.body.phone);
  if (existingUser) {
    return next(new Conflict(await Translate.get(languageCode, 'user_exist')));
  }

  let role: Role;
  if (!roleId) {
    role = await Database.roleRepository.getRoleByName(UserRole.CLIENT);
  } else {
    role = await Database.roleRepository.findById({ id: roleId });
    if (
      role &&
      (role.name === UserRole.SUPER_ADMIN || role.name === UserRole.ADMIN) &&
      ![UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(apiUser?.role?.name as UserRole)
    ) {
      return next(new NotFound(await Translate.get(languageCode, 'role_not_found')));
    }
  }

  if (!role) {
    return next(new InternalServerError(await Translate.get(languageCode, 'role_not_found')));
  }

  let password: User['password'] = '';

  if (!req.body.password) {
    password = generatePassword(16);
  } else {
    password = req.body.password;
  }

  // In case if this is admin user and setting user verification as Auto, no need to verify account
  if (req.body.verifyType === NotificationOption.AUTO) {
    verifyKey = null;
    verifyToken = null;
    verifiedAt = req.body.verifiedAt ? req.body.verifiedAt : new Date().toISOString();
  }

  const userPayload: User = {
    profilePicture,
    verifyKey,
    verifyToken,
    verifiedAt,
    verifiedById,
    createdById,
    password,
    role,
    ...req.body,
  };

  const user = await Database.userRepository.createAndSave(userPayload);
  if (!user) {
    return next(new InternalServerError(await Translate.get(languageCode, 'user_create_error')));
  }

  result = await Database.userRepository.findById({ id: user.id });
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'user_create_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'user_create_success'),
    result,
  });
});
