import { BaseRepository } from './BaseRepository';
import { Language } from '../entity';
import { Database } from '../index';

export class LanguageRepository extends BaseRepository<Language> {
  constructor(database: typeof Database) {
    super(database, Language);
  }

  async getDefaultLanguage() {
    return await this.instance
      .createQueryBuilder('language')
      .where('language.isDefault = :isDefault', { isDefault: true })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  /**
   * get a Language Id by Language Code
   * @param code
   */

  async getLanguageIdByCode(code: string) {
    return await this.instance
      .createQueryBuilder('language')
      .where('language.code = :code', { code })
      .select(['language.id'])
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  /**
   * get a language with translations by language id
   * @param id
   */

  async getLanguageWithTranslations(id: string) {
    return await this.instance
      .createQueryBuilder('language')
      .leftJoinAndSelect('language.translations', 'translation')
      .where('language.id = :id', { id })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  /**
   * List languages
   */

  async listLanguagesWithTranslations() {
    return await this.instance
      .createQueryBuilder('language')
      .leftJoinAndSelect('language.translations', 'translation')
      .getMany()
      .catch((err: Error) => {
        throw err;
      });
  }

  async bulkCreateLanguages(languages: Language[]) {
    return await this.instance
      .createQueryBuilder()
      .insert()
      .into(Language)
      .values(languages)
      .execute()
      .catch((err: Error) => {
        throw err;
      });
  }
}
