import 'dotenv/config';
import { IDbConfig, IEnvConfig, IJwtConfig, ITokenLifetimeConfig, IMulterConfig } from '../types/interface';
import { DatabaseType, NodeEnv } from '../types/enum';
import { EncryptionOptions } from 'typeorm-encrypted';

export const envConfig: IEnvConfig = {
  nodeEnv: process.env.NODE_ENV as NodeEnv,
  port: process.env.PORT || '3377',
  apiUrl: process.env.API_URL || 'http://localhost:3377',
  apiKey: process.env.API_KEY || '',
  frontendUrl: process.env.FRONTEND_URL || '',
};

export const encryptionConfig: EncryptionOptions = {
  key: process.env.ENCRYPTION_KEY || '',
  algorithm: process.env.ENCRYPTION_ALGORITHM || '',
  iv: process.env.ENCRYPTION_IV,
  ivLength: Number(process.env.ENCRYPTION_IV_LENGTH),
};

export const jwtConfig: IJwtConfig = {
  access_secret: process.env.JWT_ACCESS_SECRET,
  refresh_secret: process.env.JWT_REFRESH_SECRET,
};

export const tokenLifetimeConfig: ITokenLifetimeConfig = {
  accessToken: {
    short: Number(process.env.ACCESS_TOKEN_LIFETIME_SHORT), // seconds
    long: process.env.ACCESS_TOKEN_LIFETIME_LONG, // 1 week
  },
  refreshToken: process.env.REFRESH_TOKEN_LIFETIME, // 60 day
};

export const dbConfig: IDbConfig = {
  type: process.env.DATABASE_TYPE as DatabaseType,
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  synchronize: true,
  entities: ['src/database/entity'],
  charset: process.env.DATABASE_CHARSET,
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/database/entity',
  },
  logger: 'logs/orm.log',
  logging: ['error', 'warn'],
  maxQueryExecutionTime: 0,
};

export const multerConfig: IMulterConfig = {
  dest: process.env.MULTER_UPLOAD_DEST,
};
