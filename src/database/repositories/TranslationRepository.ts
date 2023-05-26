import { BaseRepository } from './BaseRepository';
import { Translation } from '../entity';
import { Database } from '../index';

export class TranslationRepository extends BaseRepository<Translation> {
  constructor(database: typeof Database) {
    super(database, Translation);
  }

  /**
   * get translations by language id
   * @param languageId
   * @param keys
   */

  async getTranslationsByLanguageId(languageId: string, keys: string[] | null) {
    let queryBuilder = this.instance.createQueryBuilder().where('languageId = :languageId', { languageId });

    if (keys?.length) {
      keys.forEach((key) => {
        queryBuilder = queryBuilder.andWhere('`key` = :key', { key });
      });
    }

    queryBuilder = queryBuilder.orderBy('id', 'DESC');

    return await queryBuilder.getMany().catch((err: Error) => {
      throw err;
    });
  }

  async getTranslationByKey(key: string) {
    return await this.instance
      .createQueryBuilder('translation')
      .where('translation.key = :key', { key })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  /**
   * get translations by language code
   * @param code
   * @param keys
   */

  async getTranslationsByLanguageCode(code: string, keys: string[] | null) {
    const result = await Database.languageRepository.getLanguageIdByCode(code);
    if (!result) {
      return [];
    }

    return await this.getTranslationsByLanguageId(result.id, keys);
  }

  async getTranslationsWithLanguageId() {
    return await this.instance
      .createQueryBuilder('translation')
      .select(['translation.id', 'translation.key', 'language.id'])
      .leftJoin('translation.language', 'language')
      .getMany()
      .catch((err: Error) => {
        throw err;
      });
  }

  async bulkCreateTranslations(translations: Translation[]) {
    return await this.instance
      .createQueryBuilder()
      .insert()
      .into(Translation)
      .values(translations)
      .execute()
      .catch((err: Error) => {
        throw err;
      });
  }
}
