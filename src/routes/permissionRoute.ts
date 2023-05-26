import { Router } from 'express';
import { PermissionController } from '../controller';
import { permission } from '../middlewares/auth';
import { permissionCreateValidator, permissionUpdateValidator } from '../middlewares/validator';

const {
  getPermission,
  listPermissions,
  listAvailablePermissions,
  createPermission,
  updatePermission,
  deletePermission,
  restorePermission,
} = PermissionController;

// Permission-route
const permissionRoute: Router = Router();

permissionRoute.route('/restore').post(permission(['permission_update']), restorePermission);

permissionRoute
  .route('/')
  .get(permission(['permission_read']), listPermissions)
  .post(permission(['permission_create']), permissionCreateValidator, createPermission)
  .delete(permission(['permission_delete']), deletePermission);

permissionRoute.route('/available').get(permission(['permission_read']), listAvailablePermissions);

permissionRoute
  .route('/:permissionId')
  .get(permission(['permission_read']), getPermission)
  .put(permission(['permission_update']), permissionUpdateValidator, updatePermission)
  .delete(permission(['permission_delete']), deletePermission);

export default permissionRoute;
