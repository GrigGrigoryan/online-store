import { DatabaseType, NodeEnv } from '../enum';

export interface IEnvConfig {
  port: string;
  nodeEnv: NodeEnv;
  apiUrl: string;
  apiKey: string;
  frontendUrl: string;
}

export interface IEncryptionConfig {
  key?: string;
  algorithm?: string;
  iv?: string;
  ivLength: number;
}

export interface IJwtConfig {
  access_secret?: string;
  refresh_secret?: string;
}

export interface ITokenLifetimeConfig {
  accessToken: {
    short?: number;
    long?: string;
  };
  refreshToken?: string;
}

export interface IDbConfig {
  name?: string;
  type: DatabaseType;
  host: string;
  port?: string | number;
  username?: string;
  password?: string;
  database?: string;
  synchronize: boolean;
  dropSchema?: boolean;
  logger: string;
  logging: string[];
  entities: string[];
  charset?: string;
  maxQueryExecutionTime: number;
  migrations: string[];
  subscribers: string[];
  cli: { [key: string]: string };
}

export interface IMulterConfig {
  dest?: string;
}
