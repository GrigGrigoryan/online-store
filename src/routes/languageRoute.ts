import { Router } from 'express';
import { LanguageController } from '../controller';
import { permission } from '../middlewares/auth';
import { languageCreateValidator, languageUpdateValidator } from '../middlewares/validator';
import { fileUpload } from '../middlewares';

const {
  getLanguage,
  listLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  restoreLanguage,
  updateLanguageFont,
} = LanguageController;

// Language-route
const languageRoute: Router = Router();
const publicLanguageRoute: Router = Router();

publicLanguageRoute.route('/').get(listLanguages);
publicLanguageRoute.route('/:languageId').get(getLanguage);

languageRoute.route('/restore').post(permission(['language_update']), restoreLanguage);

languageRoute
  .route('/')
  .post(permission(['language_create']), languageCreateValidator, createLanguage)
  .delete(permission(['language_delete']), deleteLanguage);

languageRoute
  .route('/:languageId')
  .put(permission(['language_update']), languageUpdateValidator, updateLanguage)
  .delete(permission(['language_delete']), deleteLanguage);

languageRoute.route('/:languageId/font').put(permission(['language_update']), fileUpload('font'), updateLanguageFont);

export { languageRoute, publicLanguageRoute };
