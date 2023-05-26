import { FindManyOptions, ObjectLiteral, QueryBuilder, Repository, SaveOptions, TreeRepository } from 'typeorm';
import { IPaginationParams, IQueryBuilder, ISortParams, TableMetadata } from '../../types/interface';
import { EntityMetadata } from 'typeorm/metadata/EntityMetadata';
import { Base } from '../entity/Base';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { SortDirection } from '../../types/enum/SortDirection';

export class BaseRepository<T extends ObjectLiteral> {
  instance: Repository<T>;
  entity: any;
  database: any = null;
  entityMetadatas: EntityMetadata[];

  constructor(database: any, entity: any) {
    this.instance = database.connection.getRepository(entity);
    this.entity = entity;
    this.database = database;
    this.entityMetadatas = this.database.connection.entityMetadatas;
  }

  getInstance(): Repository<T> {
    return this.instance;
  }

  getTableMetadataByName(tableName: string): TableMetadata | void {
    for (const metadata of this.database.connection.entityMetadatas) {
      if ([metadata.name, metadata.tableName, metadata.tableNameWithoutPrefix].includes(tableName)) {
        return {
          names: [metadata.name, metadata.tableName, metadata.tableNameWithoutPrefix],
          properties: Object.keys(metadata.propertiesMap),
          relations: metadata.relations.map((el: any) => el.propertyName).filter((el: any) => !['createdById', 'updatedById'].includes(el)),
        };
      }
    }
  }

  getEntity() {
    return this.entity;
  }

  async save(entity: any, options?: SaveOptions) {
    return this.instance.save(entity, options);
  }

  async softRemove(entity: any) {
    return this.instance.softRemove(entity);
  }

  async bulkSoftRemove(ids: number[]) {
    return this.instance
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .softDelete()
      .execute()
      .catch((err: Error) => {
        throw err;
      });
  }

  async remove(entity: any) {
    return this.instance.remove(entity);
  }

  async bulkRemove(ids: number[]) {
    return this.instance
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .delete()
      .execute()
      .catch((err: Error) => {
        throw err;
      });
  }

  async restore(entity: any) {
    return this.instance.restore(entity);
  }

  async bulkRestore(ids: Base['id'][]) {
    return this.instance
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .restore()
      .execute()
      .catch((err: Error) => {
        throw err;
      });
  }

  create(options: any) {
    return Object.assign(new this.entity(), options);
  }

  async createAndSave(entity: any, options?: SaveOptions) {
    try {
      const created = await this.create(entity);
      return this.instance.save(created, options);
    } catch (err) {
      return err;
    }
  }

  async findById(options?: { id: Base['id']; relations?: string[]; select?: any[] }): Promise<T> {
    return await this.instance.findOne(options);
  }

  async findAll(options?: FindManyOptions): Promise<T[]> {
    return await this.instance.find(options);
  }

  async generateQueryBuilder(queryString: IQueryBuilder) {
    const query: IQueryBuilder = JSON.parse(JSON.stringify(queryString));
    const prefix: string = this.entity.name;
    let queryBuilder: SelectQueryBuilder<T> = this.instance.createQueryBuilder(prefix);

    const sort: ISortParams[] = [];
    const pagination: IPaginationParams = {};

    if ((query.limit && query.offset) || query.pagination) {
      pagination.limit = Number(query.limit || query.pagination.limit);
      pagination.offset = Number(query.offset || query.pagination.offset);
    }

    queryBuilder = this.applyPagination(queryBuilder, pagination);

    if (query.sort) {
      if (!Array.isArray(query.sort)) {
        query.sort = [query.sort];
      }

      query.sort.forEach((s: string) => {
        const [sortBy, sortAs] = s.split(',').map((el: string) => el.trim());
        sort.push({ sortBy, sortAs: sortAs.toUpperCase() as SortDirection });
      });
    }

    queryBuilder = this.applySort(queryBuilder, sort);

    if (query.withDeleted === 'true') {
      queryBuilder = queryBuilder.withDeleted();
    }

    /* uncomment to use raw query **/
    // console.log('Query Builder result', queryBuilder.getSql());

    if (query.id) {
      return await queryBuilder.getOne().catch((err: Error) => {
        throw err;
      });
    }

    return await queryBuilder.getManyAndCount().catch((err: Error) => {
      throw err;
    });
  }

  applySort(builder: SelectQueryBuilder<T>, sort: ISortParams[]): SelectQueryBuilder<T> {
    const prefix: string = this.entity.name;

    if (sort?.length) {
      const order: any = {};
      sort.forEach((s) => {
        if (s?.sortBy?.indexOf('.') === -1) {
          order[`${prefix}.${s.sortBy}`] = s.sortAs;
        } else {
          order[`${s.sortBy}`] = s.sortAs;
        }
      });
      return builder.orderBy(order);
    }
    return builder;
  }

  applyPagination(builder: SelectQueryBuilder<T>, params: IPaginationParams): SelectQueryBuilder<T> {
    const prefix: string = this.entity.name;

    if (params?.limit) {
      builder.take(params.limit);
      if (params.offset) {
        builder.skip(params.offset);
      }
    }

    return builder;
  }
}
