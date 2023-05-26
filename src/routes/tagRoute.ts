import { Router } from 'express';
import { TagController } from '../controller';
import { permission } from '../middlewares/auth';
import { tagCreateValidator, tagUpdateValidator } from '../middlewares/validator';

const { getTag, listTags, createTag, updateTag, deleteTag, restoreTag } = TagController;

// Tag-route
const tagRoute: Router = Router();
const publicTagRoute: Router = Router();
publicTagRoute.route('/').get(listTags);
publicTagRoute.route('/:tagId').get(getTag);

tagRoute.route('/restore').post(permission(['tag_update']), restoreTag);

tagRoute
  .route('/')
  .get(permission(['tag_read']), listTags)
  .post(permission(['tag_create']), tagCreateValidator, createTag)
  .delete(permission(['tag_delete']), deleteTag);

tagRoute
  .route('/:tagId')
  .get(permission(['tag_read']), getTag)
  .put(permission(['tag_update']), tagUpdateValidator, updateTag)
  .delete(permission(['tag_delete']), deleteTag);

export { tagRoute, publicTagRoute };
