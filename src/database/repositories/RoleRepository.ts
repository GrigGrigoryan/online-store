import { BaseRepository } from './BaseRepository';
import { Role } from '../entity';
import { Database } from '../index';
import { InsertResult } from 'typeorm';

export class RoleRepository extends BaseRepository<Role> {
  constructor(database: typeof Database) {
    super(database, Role);
  }

  async getRolesByIds(roleIds: Role['id'][]): Promise<Role[]> {
    return await this.instance
      .createQueryBuilder('role')
      .where('role.id IN (:...roleIds)', { roleIds })
      .getMany()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getRoleByName(name: string): Promise<Role> {
    return this.instance
      .createQueryBuilder('role')
      .select(['role.id', 'role.name'])
      .where('role.name = :name', { name })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getRoleWithPermissionsByName(roleName: Role['name']): Promise<Role> {
    return this.instance
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .select(['role.id', 'role.name', 'permissions.id', 'permissions.name'])
      .where('role.name = :roleName', { roleName })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async bulkCreateRoles(roles: Role[]): Promise<InsertResult> {
    return await this.instance
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values(roles)
      .execute()
      .catch((err: Error) => {
        throw err;
      });
  }
}
