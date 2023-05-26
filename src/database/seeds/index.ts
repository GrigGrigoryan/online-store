import { RoleSeed } from './RoleSeed';
import { LanguageSeed } from './LanguageSeed';
import { TranslationSeed } from './TranslationSeed';
import { UserSeed } from './UserSeed';
import { envConfig } from '../../config';
import { NodeEnv } from '../../types/enum';
import { PermissionSeed } from './PermissionSeed';

export class Seeder {
  static async init() {
    await LanguageSeed.init();
    await TranslationSeed.init();
    await PermissionSeed.init();
    await RoleSeed.init();
    await UserSeed.init();

    if (envConfig.nodeEnv !== NodeEnv.PROD) {
      return;
    }
  }
}
