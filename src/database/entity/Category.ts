import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Base } from './Base';
import { Item } from './Item';

@Entity()
export class Category extends Base {
  @Column({ type: 'text', nullable: false, unique: true })
  @Index()
  name: string;

  @Column({ type: 'text', nullable: false })
  @Index()
  description: string;

  @ManyToOne(() => Category, (category) => category.subCategories)
  @JoinColumn({ name: 'parentCategoryId' })
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  subCategories: Category[];

  @ManyToMany(() => Item, (item) => item.categories)
  items: Item[];
}
