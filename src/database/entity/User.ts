import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { EncryptionTransformer } from 'typeorm-encrypted';
import { Base } from './Base';
import { Role } from './Role';
import { Image } from './Image';
import { RefreshToken } from './RefreshToken';
import { encryptionConfig } from '../../config';
import { UserJWTPayload } from '../../types/type';
import { Database } from '../index';
import { UserGender, UserRole } from '../../types/enum';
import { UserRating } from '../../types/enum/UserRating';
import { Item } from './Item';

@Entity()
export class User extends Base {
  @Column({ nullable: true, type: 'text' })
  profilePicture: string;

  @Column({ type: 'text', nullable: false })
  firstName: string;

  @Column({ type: 'text', nullable: false })
  lastName: string;

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: (value: string) => value.toLowerCase(),
      from: (value: string) => value,
    },
  })
  email: string;

  @Column({ type: 'text', nullable: false })
  phone: string;

  @Column('enum', { enum: UserGender, nullable: true })
  gender: UserGender;

  @Column({
    type: 'varchar',
    nullable: true,
    select: false,
    transformer: new EncryptionTransformer(encryptionConfig),
  })
  verifyKey: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  verifyToken: string;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'verifiedById' })
  verifiedById: User['id'];

  @Column({ type: 'timestamp', nullable: true })
  blockedAt: Date;

  @Column({
    type: 'varchar',
    nullable: true,
    select: false,
    transformer: new EncryptionTransformer(encryptionConfig),
  })
  password: string;

  @Column({ type: 'timestamp', nullable: true })
  birthDate: Date;

  @Column('enum', { enum: UserRating, nullable: true })
  rating: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => RefreshToken, (refreshTokens) => refreshTokens.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => Item, (item) => item.user)
  items: Item[];

  @OneToMany(() => Image, (image) => image.user)
  images: Image[];

  public async getUserJWTPayload(userRole: UserRole): Promise<UserJWTPayload> {
    const role: Role = (await Database.roleRepository.getRoleWithPermissionsByName(userRole)) as Role;

    return {
      fullName: `${this.firstName} - ${this.lastName}`,
      userId: this.id,
      profilePicture: this.profilePicture,
      email: this.email,
      phone: this.phone,
      role,
    };
  }
}
