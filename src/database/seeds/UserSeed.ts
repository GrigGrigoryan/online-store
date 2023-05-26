import { Database } from '../index';
import { UsersData } from './resource';
import { InternalServerError } from '../../core/errors';
import { Role, User } from '../entity';
import { envConfig } from '../../config';
import { NodeEnv, UserRole } from '../../types/enum';

export class UserSeed {
  static async init() {
    const existingUsers = await Database.userRepository.findAll();
    if (!existingUsers.length) {
      let usersToSeed = [...UsersData];
      if (envConfig.nodeEnv === NodeEnv.PROD) {
        usersToSeed = usersToSeed.filter((it) => it.role === UserRole.SUPER_ADMIN);
      }
      for (const userPayload of usersToSeed) {
        let result: User;
        const role: Role = await Database.roleRepository.getRoleByName(userPayload?.role);
        result = await Database.userRepository.createAndSave({
          ...userPayload?.payload,
          role,
        });
        if (!result) {
          return new InternalServerError('user_seed_error');
        }
      }
    }
  }
}
