import { Router } from 'express';
import { AuthController } from '../controller';
import { userRegisterValidator } from '../middlewares/validator';
import { authentication } from '../middlewares/auth';

const { loginUser, logoutUser, registerUser, verifyUserRegister, refreshToken } = AuthController;

// Auth-route
const authRoute: Router = Router();
authRoute.route('/login').post(loginUser);
authRoute.route('/logout').post(authentication, logoutUser);
authRoute.route('/register').post(userRegisterValidator, registerUser);
authRoute.route('/register/verify').post(verifyUserRegister);
authRoute.route('/refresh-token/:refreshKey').get(refreshToken);

export default authRoute;
