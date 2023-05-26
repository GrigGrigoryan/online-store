import { Database } from '../index';
import { PermissionsData } from './resource';
import { InternalServerError } from '../../core/errors';
import { Permission } from '../entity';

export class PermissionSeed {
  static async init() {
    const existingPermissions = await Database.permissionRepository.findAll();
    if (!existingPermissions.length) {
      const permissions = await Database.permissionRepository.bulkCreatePermissions((PermissionsData as unknown) as Permission[]);
      if (!permissions) {
        return new InternalServerError('permission_seed_error');
      }
    }
  }
}
