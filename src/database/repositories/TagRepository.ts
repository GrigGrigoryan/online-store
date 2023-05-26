import { BaseRepository } from './BaseRepository';
import { Category, Tag } from '../entity';
import { Database } from '../index';

export class TagRepository extends BaseRepository<Tag> {
  constructor(database: typeof Database) {
    super(database, Tag);
  }

  async getTagsByIds(tagIds: Tag['id'][]): Promise<Tag[]> {
    return await this.instance
      .createQueryBuilder('tag')
      .where('tag.id IN (:...tagIds)', { tagIds })
      .getMany()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getTagWithItemsById(tagId: Tag['id']) {
    return await this.instance
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.items', 'item')
      .where('tag.id = :tagId', { tagId })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getTagByName(tagName: Tag['name']) {
    return await this.instance
      .createQueryBuilder('tag')
      .where('tag.name = :tagName', { tagName })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async bulkCreateTags(tags: Tag[]) {
    return await this.instance
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values(tags)
      .execute()
      .catch((err: Error) => {
        throw err;
      });
  }
}
