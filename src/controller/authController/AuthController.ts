import { NextFunction as Next, Request as Req, Response as Res } from 'express';
import { loginUser } from './loginUser';
import { logoutUser } from './logoutUser';
import { registerUser } from './registerUser';
import { refreshToken } from './refreshToken';
import { verifyUserRegister } from './verifyUserRegister';

export class AuthController {
  /**
   * Login User
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async loginUser(req: Req, res: Res, next: Next) {
    loginUser(req, res, next);
  }

  /**
   * Logout User
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async logoutUser(req: Req, res: Res, next: Next) {
    logoutUser(req, res, next);
  }

  /**
   * Register User
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async registerUser(req: Req, res: Res, next: Next) {
    registerUser(req, res, next);
  }

  /**
   * Verify User Register
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async verifyUserRegister(req: Req, res: Res, next: Next) {
    verifyUserRegister(req, res, next);
  }

  /**
   * Refresh User Token
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async refreshToken(req: Req, res: Res, next: Next) {
    refreshToken(req, res, next);
  }
}
