import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './Base';
import { Language } from './Language';

@Entity()
export class Translation extends Base {
  @Column({ type: 'text', nullable: false })
  key: string;

  @Column({ type: 'text', nullable: false })
  value: string;

  @ManyToOne(() => Language, (language) => language.translations)
  @JoinColumn({ name: 'languageId' })
  language: Language;
}
