import { IDbConfig } from '../../types/interface';
import { ConnectionOptions, createConnection, getConnection } from 'typeorm';
import * as DBEntities from '../entity';
import { Base } from '../entity/Base';
import { Connection } from 'typeorm';
import 'reflect-metadata';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

export class DatabaseConnection {
  public static connection?: Connection;

  static async initConnection(dbConfig: IDbConfig): Promise<Connection> {
    try {
      if (!this.connection) {
        const entities: typeof Base[] = Object.values(DBEntities).map((entity: typeof Base) => entity);

        const connectionOptions = { ...dbConfig, entities } as ConnectionOptions;
        this.connection = await createConnection(connectionOptions);
      }

      return this.connection;
    } catch (err) {
      throw err;
    }
  }

  static async startTransaction(name?: string): Promise<QueryRunner> {
    try {
      const queryRunner = getConnection(name).createQueryRunner();
      await queryRunner.startTransaction();

      return queryRunner;
    } catch (err) {
      throw err;
    }
  }

  static async closeConnection(name: string): Promise<void | Error> {
    try {
      this.connection = getConnection(name);
      await this.connection.close();
    } catch (err) {
      throw err;
    }
  }

  static async clearConnection(name: string): Promise<void | Error> {
    try {
      this.connection = getConnection(name);
      const entities = this.connection.entityMetadatas;

      for (const entity of entities) {
        const repository = this.connection.getRepository(entity.name); // Get repository
        await repository.clear(); // Clear each entity table's content
      }
    } catch (err) {
      throw err;
    }
  }
}
