import { Router } from 'express';
import { UserController } from '../controller';
import { permission } from '../middlewares/auth';
import { userCreateValidator, userUpdateValidator } from '../middlewares/validator';
import { fileUpload } from '../middlewares';

const { getUser, listUsers, createUser, updateUser, deleteUser, restoreUser, uploadUserProfilePictureImage } = UserController;

// User-route
const userRoute: Router = Router();

userRoute.route('/restore').post(permission(['user_update']), restoreUser);

userRoute
  .route('/')
  .get(permission(['user_read']), listUsers)
  .post(permission(['user_create']), userCreateValidator, createUser)
  .delete(permission(['user_delete']), deleteUser);

userRoute
  .route('/:userId')
  .get(permission(['user_read']), getUser)
  .put(permission(['user_update']), userUpdateValidator, updateUser)
  .delete(permission(['user_delete']), deleteUser);

userRoute
  .route('/:userId/profile-picture')
  .put(permission(['user_profile_update']), fileUpload('profile_picture'), uploadUserProfilePictureImage);

export default userRoute;
