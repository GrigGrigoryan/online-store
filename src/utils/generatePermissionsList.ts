import { PermissionLevel, PermissionResource } from '../types/enum';
import { Permission } from '../database/entity';

export const generatePermissionsList = (): Permission['name'][] => {
  const resources: PermissionResource[] = Object.values(PermissionResource);
  const levels: PermissionLevel[] = Object.values(PermissionLevel);

  const validPermissions: Permission['name'][] = [];
  for (const resource of resources) {
    for (const level of levels) {
      validPermissions.push(`${resource}_${level}`);
    }
  }

  return validPermissions;
};
