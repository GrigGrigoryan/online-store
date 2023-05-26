import { Router } from 'express';
import { ItemController } from '../controller';
import { permission } from '../middlewares/auth';
import { itemCreateValidator, itemUpdateValidator } from '../middlewares/validator';
import { fileUpload } from '../middlewares';

const { getItem, listItems, createItem, updateItem, deleteItem, restoreItem, uploadItemImage } = ItemController;

// Item-route
const itemRoute: Router = Router();
const publicItemRoute: Router = Router();
publicItemRoute.route('/').get(listItems);
publicItemRoute.route('/:itemId').get(getItem);

itemRoute.route('/restore').post(permission(['item_update']), restoreItem);

itemRoute
  .route('/')
  .get(permission(['item_read']), listItems)
  .post(permission(['item_create']), itemCreateValidator, createItem)
  .delete(permission(['item_delete']), deleteItem);

itemRoute
  .route('/:itemId')
  .get(permission(['item_read']), getItem)
  .put(permission(['item_update']), itemUpdateValidator, updateItem)
  .delete(permission(['item_delete']), deleteItem);

itemRoute.route('/:itemId/upload').put(permission(['item_update']), fileUpload('item_image'), uploadItemImage);

export { itemRoute, publicItemRoute };
