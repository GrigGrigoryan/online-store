import { NextFunction as Next, Request as Req, Response as Res } from 'express';
import { asyncHandler } from '../../utils';
import { Database } from '../../database';
import { LanguageCode, NotificationOption, StatusCode, UserRole } from '../../types/enum';
import { BadRequest, Forbidden, InternalServerError, NotFound } from '../../core/errors';
import { Image, Role, User } from '../../database/entity';
import { IQueryBuilder } from '../../types/interface';
import { UserJWTPayload } from '../../types/type';
import { Translate } from '../../services';
import { ImageType } from '../../types/enum/ImageType';
import { getManager } from 'typeorm';
import fs from 'fs';

/**
 * Update user
 * @param req Request
 * @param res Response
 * @param next
 */
export const updateUser = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const apiUser: UserJWTPayload = res.locals?.userPayload;
  const updatedById: User['id'] = apiUser.userId;
  const roleId: Role['id'] = req.body.roleId;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  const userId: User['id'] = req.params.userId;
  const query: IQueryBuilder = {
    id: userId,
  };

  const user = (await Database.userRepository.generateQueryBuilder(query)) as User;
  if (!user) {
    return next(new NotFound(await Translate.get(languageCode, 'user_not_found')));
  }

  if (user.id !== apiUser.userId) {
    switch (user.role?.name) {
      case UserRole.ADMIN:
        if (apiUser?.role?.name !== UserRole.SUPER_ADMIN) {
          return next(new Forbidden(await Translate.get(languageCode, 'role_required')));
        }
        break;
      case UserRole.CLIENT:
        if (![UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(apiUser?.role?.name)) {
          return next(new Forbidden(await Translate.get(languageCode, 'role_required')));
        }
        break;
      default:
        break;
    }
  }

  if (roleId && user.id !== apiUser?.userId) {
    const role = await Database.roleRepository.findById({ id: roleId });
    if (!role) {
      return next(new NotFound(await Translate.get(languageCode, 'role_not_found')));
    }
    user.role = role;
  }

  // In case if this is admin user and setting user verification as Auto, no need to verify account
  if (req.body.verifyType === NotificationOption.AUTO) {
    req.body.verifyKey = null;
    req.body.verifyToken = null;
    req.body.verifiedById = apiUser.userId;
    req.body.verifiedAt = req.body.verifiedAt ? req.body.verifiedAt : new Date().toISOString();
  }

  const updatedUser: any = {
    ...user,
    ...req.body,
    updatedById,
  };

  const result = await Database.userRepository.save(updatedUser);
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'user_update_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'user_update_success'),
    result,
  });
});

/**
 * Update user
 * @param req Request
 * @param res Response
 * @param next
 */
export const uploadUserProfilePictureImage = asyncHandler(async (req: Req, res: Res, next: Next) => {
  const userId: string = req.params.userId;
  const languageCode = (req.headers['x-lang'] || LanguageCode.ENGLISH) as LanguageCode;

  if (!req.file?.filename) {
    return next(new BadRequest(await Translate.get(languageCode, 'profile_picture_required')));
  }

  const profilePictureUrl: User['profilePicture'] = req.file?.path?.slice(7) || '';

  const user = await Database.userRepository.findById({ id: userId });
  if (!user) {
    return next(new NotFound(await Translate.get(languageCode, 'user_not_found')));
  }

  let image: Image = (await Database.imageRepository.getProfilePictureByUserId(user.id)) as Image;

  let result: User;
  await getManager().transaction(async (transactionalEntityManager) => {
    if (image) {
      // removes existing profile picture from files
      const existingImages = fs.readdirSync(`static/uploads`);
      for (const file of existingImages) {
        if (file === image.url.slice(8)) {
          fs.unlinkSync(`static/uploads/${file}`);
        }
      }

      image.url = profilePictureUrl;
      image = await transactionalEntityManager.save(Image, { user, ...image });
    } else {
      const newImage: Image = await new Image();
      newImage.user = user;
      newImage.url = profilePictureUrl;
      newImage.type = ImageType.PROFILE;

      image = await transactionalEntityManager.save(Image, newImage);
    }

    result = await transactionalEntityManager.save(User, { ...user, profilePicture: profilePictureUrl });
  });
  if (!result) {
    return next(new InternalServerError(await Translate.get(languageCode, 'user_profile_picture_update_error')));
  }

  return res.status(StatusCode.OK).send({
    message: await Translate.get(languageCode, 'user_profile_picture_update_success'),
    result,
  });
});
