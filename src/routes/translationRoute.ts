import { Router } from 'express';
import { TranslationController } from '../controller';
import { permission } from '../middlewares/auth';
import { translationCreateValidator, translationUpdateValidator } from '../middlewares/validator';

const {
  getTranslation,
  listTranslations,
  createTranslation,
  updateTranslation,
  deleteTranslation,
  restoreTranslation,
} = TranslationController;

// Translation-route
const translationRoute: Router = Router();
const publicTranslationRoute: Router = Router();
publicTranslationRoute.route('/').get(listTranslations);
publicTranslationRoute.route('/:translationId').get(getTranslation);

translationRoute.route('/restore').post(permission(['translation_update']), restoreTranslation);

translationRoute
  .route('/')
  .get(permission(['translation_read']), listTranslations)
  .post(permission(['translation_create']), translationCreateValidator, createTranslation)
  .delete(permission(['translation_delete']), deleteTranslation);

translationRoute
  .route('/:translationId')
  .get(permission(['translation_read']), getTranslation)
  .put(permission(['translation_update']), translationUpdateValidator, updateTranslation)
  .delete(permission(['translation_delete']), deleteTranslation);

export { translationRoute, publicTranslationRoute };
