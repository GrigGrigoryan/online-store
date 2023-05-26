import { UserRole } from '../../../types/enum';

export const RolesData = Object.values(UserRole).map((name) => {
  return { name };
});
