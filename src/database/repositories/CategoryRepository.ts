import { BaseRepository } from './BaseRepository';
import { Category, User } from '../entity';
import { Database } from '../index';
import { createTree, getParentIdsById } from '../../utils';

export class CategoryRepository extends BaseRepository<Category> {
  constructor(database: typeof Database) {
    super(database, Category);
  }

  async getCategoryByName(categoryName: Category['name']): Promise<Category> {
    return await this.instance
      .createQueryBuilder('category')
      .where('category.name = :categoryName', { categoryName })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.instance
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.subCategories', 'subCategory')
      .leftJoinAndSelect('category.parentCategory', 'parentCategory')
      .select(['category.id', 'category.name', 'category.parentCategoryId', 'category.description', 'subCategory.id', 'parentCategory.id'])
      .getMany()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getCategoryById(categoryId: Category['id']): Promise<Category> {
    return await this.instance
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.items', 'items')
      .leftJoinAndSelect('category.subCategories', 'subCategory')
      .leftJoinAndSelect('category.parentCategory', 'parenCategory')
      .where('category.id = :categoryId', { categoryId })
      .getOne()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getCategoriesByIds(categoryIds: Category['id'][]): Promise<Category[]> {
    return await this.instance
      .createQueryBuilder('category')
      .where('category.id IN (:...categoryIds)', { categoryIds })
      .getMany()
      .catch((err: Error) => {
        throw err;
      });
  }

  async getParentsByCategoryId(categoryId: Category['id']): Promise<string[]> {
    return await this.getAllCategories()
      .then((categories: Category[]) => {
        return getParentIdsById(categories, categoryId);
      })
      .catch((err: Error) => {
        throw err;
      });
  }

  async getCategoriesTree(): Promise<Category[]> {
    return await this.getAllCategories()
      .then((categories: Category[]) => {
        return createTree(categories);
      })
      .catch((err: Error) => {
        throw err;
      });
  }

  async bulkCreateCategories(categories: Category[]) {
    return await this.instance
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values(categories)
      .execute()
      .catch((err: Error) => {
        throw err;
      });
  }
}
