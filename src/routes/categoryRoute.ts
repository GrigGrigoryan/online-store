import { Router } from 'express';
import { CategoryController } from '../controller';
import { permission } from '../middlewares/auth';
import { categoryCreateValidator, categoryUpdateValidator } from '../middlewares/validator';

const { getCategory, listCategories, createCategory, updateCategory, deleteCategory, restoreCategory } = CategoryController;

// Category-route
const categoryRoute: Router = Router();
const publicCategoryRoute: Router = Router();
publicCategoryRoute.route('/').get(listCategories);
publicCategoryRoute.route('/:categoryId').get(getCategory);

categoryRoute.route('/restore').post(permission(['category_update']), restoreCategory);

categoryRoute
  .route('/')
  .get(permission(['category_read']), listCategories)
  .post(permission(['category_create']), categoryCreateValidator, createCategory)
  .delete(permission(['category_delete']), deleteCategory);

categoryRoute
  .route('/:categoryId')
  .get(permission(['category_read']), getCategory)
  .put(permission(['category_update']), categoryUpdateValidator, updateCategory)
  .delete(permission(['category_delete']), deleteCategory);

export { categoryRoute, publicCategoryRoute };
