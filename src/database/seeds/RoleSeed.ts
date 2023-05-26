import { Database } from '../index';
import { RolesData } from './resource';
import { InternalServerError } from '../../core/errors';
import { Permission, Role } from '../entity';
import { UserRole } from '../../types/enum';

export class RoleSeed {
  static async init() {
    const existingRoles = await Database.roleRepository.findAll();
    if (!existingRoles.length) {
      const permissions: Permission[] = await Database.permissionRepository.findAll();
      const rolesPayload: Role[] = RolesData.map((role: Role) => {
        if (role.name === UserRole.ADMIN || role.name === UserRole.SUPER_ADMIN) {
          role.permissions = permissions;
        }

        return role;
      });
      const roles = await Database.roleRepository.bulkCreateRoles(rolesPayload as Role[]);
      if (!roles) {
        return new InternalServerError('role_seed_error');
      }
    }
  }
}
