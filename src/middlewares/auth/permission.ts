import { NextFunction as Next, Request as Req, RequestHandler, Response as Res } from 'express';
import { Forbidden } from '../../core/errors';
import { UserJWTPayload } from '../../types/type';
import { PermissionResource, UserRole } from '../../types/enum';
import { envConfig } from '../../config';
import { Permission, Role } from '../../database/entity';

export const permission = (requiredPermissions: Permission['name'][]): RequestHandler => {
  return (req: Req, res: Res, next: Next) => {
    const userPayload: UserJWTPayload = res.locals.userPayload as UserJWTPayload;
    const apiKey: string = req.headers['x-api-key'] as string;
    const role: Role = userPayload?.role;

    if (role?.name === UserRole.SUPER_ADMIN || apiKey === envConfig.apiKey) {
      return next();
    }

    const userPermissions: Permission['name'][] = role?.permissions.map((userPermission: Permission) => userPermission.name);

    // check if user role has required permissions
    const allow: boolean = requiredPermissions.every((requiredPermission: Permission['name']) => {
      if (
        requiredPermission.includes(PermissionResource.USER || PermissionResource.USER_PROFILE) &&
        userPayload?.userId === req.params.userId
      ) {
        return true;
      }

      return userPermissions.find((userPermission: Permission['name']) => {
        return userPermission === requiredPermission;
      });
    });

    if (!allow) {
      return next(new Forbidden('permission_required'));
    }

    return next();
  };
};
