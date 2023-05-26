import { Database } from '../database';
import { Language, Translation } from '../database/entity';

export class Translate {
  private static _instance: Translate;
  public static get instance(): Translate {
    if (!this._instance) {
      this._instance = new Translate();
    }
    return this._instance;
  }
  translations: Translation[];
  languages: Language[];
  lastFetched: number;
  async init() {
    this.translations = await Database.translationRepository.getTranslationsWithLanguageId();
    this.languages = await Database.languageRepository.findAll({
      select: ['id', 'code'],
    });
  }

  static async get(languageCode: string, translationKey: string) {
    const now: number = new Date().getTime();
    const inst: Translate = Translate.instance;

    if (!inst.lastFetched || inst.lastFetched + 60000 < now) {
      await inst.init();
      inst.lastFetched = now;
    }
    return await inst.findTranslation(languageCode, translationKey);
  }

  private async findTranslation(languageCode: string, translationKey: string) {
    if (!this.translations || !this.languages) {
      return translationKey;
    }
    const language = this.languages.find((l) => l.code === languageCode);
    if (!language) {
      return translationKey;
    }

    const translation = this.translations.find((t) => {
      return t && t.key === translationKey && t.language.id === language.id;
    });

    if (!translation) {
      const createdTranslation: Translation = await Database.translationRepository.createAndSave({
        key: translationKey,
        value: translationKey.replace(/_+/g, ' '),
        language,
      });

      await Translate.instance.init().catch((error) => console.error(error));

      return createdTranslation.value;
    }
    return translation.value || translationKey;
  }
}
