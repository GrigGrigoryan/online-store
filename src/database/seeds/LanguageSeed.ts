import { Database } from '../index';
import { LanguagesData } from './resource';
import { Language } from '../entity';
import { InternalServerError } from '../../core/errors';

export class LanguageSeed {
  static async init() {
    const existingLanguages = await Database.languageRepository?.findAll();
    if (!existingLanguages?.length) {
      const languages = await Database.languageRepository?.bulkCreateLanguages(LanguagesData as Language[]);
      if (!languages) {
        return new InternalServerError('language_seed_error');
      }
    }
  }
}
