import { Router } from 'express';
import { RoleController } from '../controller';
import { permission } from '../middlewares/auth';
import { roleCreateValidator, roleUpdateValidator } from '../middlewares/validator';

const { getRole, listRoles, createRole, updateRole, deleteRole, restoreRole } = RoleController;

// Role-route
const roleRoute: Router = Router();

roleRoute.route('/restore').post(permission(['role_update']), restoreRole);

roleRoute
  .route('/')
  .get(permission(['role_read']), listRoles)
  .post(permission(['role_create']), roleCreateValidator, createRole)
  .delete(permission(['role_delete']), deleteRole);

roleRoute
  .route('/:roleId')
  .get(permission(['role_read']), getRole)
  .put(permission(['role_update']), roleUpdateValidator, updateRole)
  .delete(permission(['role_delete']), deleteRole);

export default roleRoute;
