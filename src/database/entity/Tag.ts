import { Column, Entity, Index, ManyToMany } from 'typeorm';
import { Base } from './Base';
import { Item } from './Item';

@Entity()
export class Tag extends Base {
  @Column({ type: 'text', nullable: false, unique: true })
  @Index()
  name: string;

  @ManyToMany(() => Item, (item) => item.tags)
  items: Item[];
}
