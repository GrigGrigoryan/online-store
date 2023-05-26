import { Database } from '../index';
import { TranslationsData } from './resource';
import { Translation } from '../entity';
import { InternalServerError } from '../../core/errors';

export class TranslationSeed {
  static async init() {
    const existingTranslations: Translation[] = await Database.translationRepository?.findAll();
    if (!existingTranslations.length) {
      const translations = await Database.translationRepository.bulkCreateTranslations(TranslationsData as Translation[]);
      if (!translations) {
        return new InternalServerError('translation_seed_error');
      }
    }
  }
}
