import { generatePermissionsList } from '../../../utils';

export const PermissionsData = generatePermissionsList().map((name) => {
  return { name };
});
