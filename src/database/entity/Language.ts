import { Entity, Column, OneToMany } from 'typeorm';
import { Base } from './Base';
import { Translation } from './Translation';

@Entity()
export class Language extends Base {
  @Column({ type: 'text', nullable: false })
  code: string;

  @Column({ type: 'text', nullable: false })
  shortCode: string;

  @Column({ type: 'text', nullable: false })
  label: string;

  @Column({ type: 'text', nullable: true })
  font: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  isDefault: boolean;

  @OneToMany(() => Translation, (translations) => translations.language)
  translations: Translation[];
}
