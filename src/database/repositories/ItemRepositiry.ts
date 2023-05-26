import { BaseRepository } from './BaseRepository';
import { Item } from '../entity';
import { Database } from '../index';
import { IQueryBuilder } from '../../types/interface';
import { Brackets } from 'typeorm';
import Logger from '../../core/Logger';
import { BadRequest, InternalServerError } from '../../core/errors';

export class ItemRepository extends BaseRepository<Item> {
  constructor(database: typeof Database) {
    super(database, Item);
  }

  async getItemById(itemId: Item['id']): Promise<Item> {
    return await this.instance
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.tags', 'tag')
      .leftJoinAndSelect('item.categories', 'category')
      .leftJoinAndSelect('item.images', 'image')
      .where('item.id = :itemId', { itemId })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getItemWithImages(itemId: Item['id']): Promise<Item> {
    return await this.instance
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.images', 'image')
      .where('item.id = :itemId', { itemId })
      .select(['item.id', 'image.id'])
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async searchItemsByQuery(query: IQueryBuilder): Promise<[Item[], number] | void> {
    const searchBy = query.searchBy.split(',');
    const q = query.q;

    const queryBuilder = await this.instance
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.tags', 'tag')
      .andWhere(
        new Brackets((qb) => {
          for (const prop of searchBy) {
            if (prop === 'tag' || prop === 'tags') {
              qb.orWhere(`tag.name like :criteria`, { criteria: `%${q}%` });
            } else {
              qb.orWhere(`item.${prop} like :criteria`, { criteria: `%${q}%` });
            }
          }
        })
      );

    return await queryBuilder.getManyAndCount().catch((err: Error) => {
      throw err;
    });
  }

  async bulkCreateItems(items: Item[]) {
    return await this.instance
      .createQueryBuilder()
      .insert()
      .into(Item)
      .values(items)
      .execute()
      .catch((err: Error) => {
        throw err;
      });
  }
}
