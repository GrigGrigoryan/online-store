import { BaseRepository } from './BaseRepository';
import { User } from '../entity';
import { Database } from '../index';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

export class UserRepository extends BaseRepository<User> {
  constructor(database: typeof Database) {
    super(database, User);
  }

  async getUserByEmailOrPhone(withPassword: boolean, email: User['email'], phone?: User['phone']): Promise<User> {
    const queryBuilder: SelectQueryBuilder<User> = await this.instance
      .createQueryBuilder('user')
      .leftJoin('user.role', 'role')
      .select(['user.id', 'user.email', 'user.phone', 'user.password', 'user.verifiedAt', 'role.name' /*, 'permission.name'*/])
      .where((qb) => {
        qb.orWhere('user.email = :email', { email });
        if (phone) {
          qb.orWhere('user.phone = :phone', { phone });
        }
      });

    if (withPassword) {
      queryBuilder.addSelect('user.password');
    }
    return await queryBuilder.getOne().catch((err: Error) => {
      throw err;
    });
  }

  async getUserData(userId: User['id']): Promise<User> {
    return await this.instance
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.items', 'item')
      .leftJoinAndSelect('user.images', 'image')
      .where('user.id = :userId', { userId })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getVerifyKeyWithRefreshTokensByToken(verifyToken: string) {
    return await this.instance
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.refreshTokens', 'refreshToken')
      .where('user.verifyToken = :verifyToken', { verifyToken })
      .addSelect('user.verifyKey')
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getVerifyKeyByToken(verifyToken: string) {
    return await this.instance
      .createQueryBuilder('user')
      .where('user.verifyToken = :verifyToken', { verifyToken })
      .addSelect('user.verifyKey')
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getUserWithRefreshTokenAndRoleByKey(refreshKey: string) {
    return await this.instance
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.refreshTokens', 'refreshToken')
      .leftJoinAndSelect('user.role', 'role')
      .where('refreshToken.refreshKey = :refreshKey', { refreshKey })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async bulkCreateUsers(users: User[]) {
    return await this.instance
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(users)
      .execute()
      .catch((err: Error) => {
        throw err;
      });
  }
}
