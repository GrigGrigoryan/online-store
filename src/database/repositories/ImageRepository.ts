import { BaseRepository } from './BaseRepository';
import { Image, User } from '../entity';
import { Database } from '../index';
import { ImageType } from '../../types/enum/ImageType';

export class ImageRepository extends BaseRepository<Image> {
  constructor(database: typeof Database) {
    super(database, Image);
  }

  async getDefaultProfilePicture(): Promise<Image> {
    return await this.instance
      .createQueryBuilder('image')
      .where('image.type = :imageType', { imageType: ImageType.DEFAULT })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async bulkCreateImages(images: Image[]) {
    return await this.instance
      .createQueryBuilder()
      .insert()
      .into(Image)
      .values(images)
      .execute()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getProfilePictureByUserId(id: User['id']): Promise<Image> {
    return await this.instance
      .createQueryBuilder('image')
      .leftJoin('image.user', 'user')
      .where('user.id = :id', { id })
      .andWhere('image.type = :type', { type: ImageType.PROFILE })
      .select(['image.id', 'image.url'])
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }
}
