import { BaseRepository } from './BaseRepository';
import { Permission, Tag } from '../entity';
import { Database } from '../index';

export class PermissionRepository extends BaseRepository<Permission> {
  constructor(database: typeof Database) {
    super(database, Permission);
  }

  async getPermissionByName(name: string): Promise<Permission> {
    return this.instance
      .createQueryBuilder('permission')
      .select(['permission.id', 'permission.name'])
      .where('permission.name = :name', { name })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getPermissionsByIds(permissionIds: Permission['id'][]): Promise<Permission[]> {
    return await this.instance
      .createQueryBuilder('permission')
      .where('permission.id IN (:...permissionIds)', { permissionIds })
      .getMany()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getPermissionWithRolesByName(name: string): Promise<Permission> {
    return this.instance
      .createQueryBuilder('permission')
      .leftJoinAndSelect('permission.roles', 'role')
      .select(['permission.id', 'permission.name', 'role.name'])
      .where('permission.name = :name', { name })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async bulkCreatePermissions(permissions: Permission[]) {
    return await this.instance
      .createQueryBuilder()
      .insert()
      .into(Permission)
      .values(permissions)
      .execute()
      .catch((err: Error) => {
        throw err;
      });
  }
}
