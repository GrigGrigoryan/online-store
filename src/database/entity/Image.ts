import { Column, Entity, ManyToMany, ManyToOne, OneToOne } from 'typeorm';
import { Base } from './Base';
import { Item } from './Item';
import { User } from './User';
import { ImageType } from '../../types/enum/ImageType';

@Entity()
export class Image extends Base {
  @Column({ type: 'text', nullable: false })
  url: string;

  @Column('enum', { enum: ImageType, nullable: false, default: ImageType.DEFAULT })
  type: ImageType;

  @ManyToOne(() => User, (user) => user.images)
  user: User;

  @ManyToMany(() => Item, (item) => item.images)
  items: Item[];
}
