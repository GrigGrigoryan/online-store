import { Category } from '../database/entity';

export function createTree(categories: Category[], parentId?: string): any[] {
  const tree: any[] = [];

  for (const category of categories) {
    if (category.parentCategory?.id === parentId) {
      const children = createTree(categories, category.id);
      if (children.length > 0) {
        category.subCategories = children;
      }
      tree.push(category);
    } else if (category.subCategories && category.subCategories.length > 0) {
      const children = createTree(category.subCategories, parentId);
      if (children.length > 0) {
        category.subCategories = children;
        tree.push(category);
      }
    }
  }

  return tree;
}

export function getParentIdsById(categories: Category[], targetId: string): string[] {
  const result: string[] = [];
  const category = categories.find((c) => c.id === targetId);

  if (category) {
    result.push(category.id);

    if (category.parentCategory) {
      result.push(...getParentIdsById(categories, category.parentCategory.id));
    }
  }

  return result;
}
