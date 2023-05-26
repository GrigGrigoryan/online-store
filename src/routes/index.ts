import { Router } from 'express';
import userRoute from './userRoute';
import { translationRoute, publicTranslationRoute } from './translationRoute';
import { languageRoute, publicLanguageRoute } from './languageRoute';
import roleRoute from './roleRoute';
import authRoute from './authRoute';
import { categoryRoute, publicCategoryRoute } from './categoryRoute';
import { itemRoute, publicItemRoute } from './itemRoute';
import { tagRoute, publicTagRoute } from './tagRoute';
import permissionRoute from './permissionRoute';

const apiRouter: Router = Router();

const publicRouter: Router = Router();
publicRouter.use('/auth', authRoute);
publicRouter.use('/language', publicLanguageRoute);
publicRouter.use('/translation', publicTranslationRoute);
publicRouter.use('/category', publicCategoryRoute);
publicRouter.use('/item', publicItemRoute);
publicRouter.use('/tag', publicTagRoute);

const adminRouter: Router = Router();

adminRouter.use('/user', userRoute);
adminRouter.use('/role', roleRoute);
adminRouter.use('/permission', permissionRoute);
adminRouter.use('/language', languageRoute);
adminRouter.use('/translation', translationRoute);
adminRouter.use('/category', categoryRoute);
adminRouter.use('/item', itemRoute);
adminRouter.use('/tag', tagRoute);

export { publicRouter, adminRouter, apiRouter };
