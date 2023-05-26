import { Entity, Column, ManyToMany, JoinTable, OneToOne, OneToMany, Index } from 'typeorm';
import { Base } from './Base';
import { User } from './User';
import { UserRole } from '../../types/enum';
import { Permission } from './Permission';

@Entity()
export class Role extends Base {
  @Column('enum', { enum: UserRole, nullable: false, unique: true })
  @Index()
  name: UserRole;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions: Permission[];

  @OneToMany(() => User, (users) => users.role)
  users: User[];
}
