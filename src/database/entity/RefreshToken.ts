import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from './Base';
import { User } from './User';

@Entity()
export class RefreshToken extends Base {
  @Column({ type: 'text', nullable: true, default: null })
  deviceId: string;

  @Column({ type: 'text', nullable: true, default: null })
  refreshKey: string;

  @Column({ type: 'boolean', default: false })
  rememberMe: boolean;

  @Column({ type: 'timestamp', nullable: false, default: new Date() })
  lastUsedAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;
}
