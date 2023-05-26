import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Base } from './Base';
import { Tag } from './Tag';
import { Image } from './Image';
import { User } from './User';
import { Category } from './Category';

@Entity()
export class Item extends Base {
  @Column({ type: 'text', nullable: false })
  @Index()
  name: string;

  @Column({ type: 'text', nullable: false })
  @Index()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'integer', nullable: false })
  quantity: number;

  @ManyToOne(() => User, (user) => user.items)
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.items)
  @JoinTable()
  tags: Tag[];

  @ManyToMany(() => Image, (image) => image.items)
  @JoinTable()
  images: Image[];

  @ManyToMany(() => Category, (category) => category.items)
  @JoinTable()
  categories: Category[];
}
