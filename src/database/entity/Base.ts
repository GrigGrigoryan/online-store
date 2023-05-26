import { CreateDateColumn, DeleteDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

export class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdById: User['id'];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updatedById' })
  updatedById: User['id'];

  public mapToListResponse() {
    return {};
  }

  public mapToDetailsResponse() {
    return {};
  }
}
