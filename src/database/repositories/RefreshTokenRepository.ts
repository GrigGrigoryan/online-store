import { BaseRepository } from './BaseRepository';
import { Database } from '../index';
import { RefreshToken } from '../entity';

export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  constructor(database: typeof Database) {
    super(database, RefreshToken);
  }

  async getRefreshTokenByKey(refreshKey: string) {
    return await this.instance
      .createQueryBuilder('refreshToken')
      .where('refreshToken.refreshKey = :refreshToken.refreshKey', { refreshKey })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getRefreshTokenByUserId(userId: string) {
    return await this.instance
      .createQueryBuilder('refreshToken')
      .where('refreshToken.userId = :userId', { userId })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getRefreshTokenByUserIdDeviceId(userId: string, deviceId: string) {
    return await this.instance
      .createQueryBuilder('refreshToken')
      .where('refreshToken.deviceId = :deviceId', { deviceId })
      .andWhere('refreshToken.userId = :userId', { userId })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }
}
