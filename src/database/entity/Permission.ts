import { Entity, Column, ManyToMany, Index } from 'typeorm';
import { Base } from './Base';
import { PermissionLevel, PermissionResource, UserRole } from '../../types/enum';
import { Role } from './Role';

@Entity()
export class Permission extends Base {
  @Column({ type: 'text', nullable: false, unique: true })
  @Index()
  name: `${PermissionResource}_${PermissionLevel}`;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
