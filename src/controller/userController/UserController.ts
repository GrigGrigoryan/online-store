import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { getUser } from './getUser';
import { createUser } from './createUser';
import { listUsers } from './listUsers';
import { deleteUser, restoreUser } from './deleteUser';
import { updateUser, uploadUserProfilePictureImage } from './updateUser';

export class UserController {
  /**
   * Get user by ID
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async getUser(req: Req, res: Res, next: Next) {
    getUser(req, res, next);
  }

  /**
   * Create a new user by admin
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async createUser(req: Req, res: Res, next: Next) {
    createUser(req, res, next);
  }

  /**
   * List all users in the system
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async listUsers(req: Req, res: Res, next: Next) {
    listUsers(req, res, next);
  }

  /**
   * Delete user
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async deleteUser(req: Req, res: Res, next: Next) {
    deleteUser(req, res, next);
  }

  /**
   * Restore user
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async restoreUser(req: Req, res: Res, next: Next) {
    restoreUser(req, res, next);
  }

  /**
   * Update user
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async updateUser(req: Req, res: Res, next: Next) {
    updateUser(req, res, next);
  }

  /**
   * Upload user profile picture image
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async uploadUserProfilePictureImage(req: Req, res: Res, next: Next) {
    uploadUserProfilePictureImage(req, res, next);
  }
}
