import { NextFunction as Next, Request as Req, Response as Res } from 'express';
import { getPermission } from './getPermission';
import { createPermission } from './createPermission';
import { listPermissions, listAvailablePermissions } from './listPermissions';
import { updatePermission } from './updatePermission';
import { deletePermission, restorePermission } from './deletePermission';

export class PermissionController {
  /**
   * Get Permission
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async getPermission(req: Req, res: Res, next: Next) {
    getPermission(req, res, next);
  }

  /**
   * List Permissions
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async listPermissions(req: Req, res: Res, next: Next) {
    listPermissions(req, res, next);
  }

  /**
   * List Available Permission
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async listAvailablePermissions(req: Req, res: Res, next: Next) {
    listAvailablePermissions(req, res, next);
  }

  /**
   * Create a new Permission
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async createPermission(req: Req, res: Res, next: Next) {
    createPermission(req, res, next);
  }

  /**
   * Update Permission
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async updatePermission(req: Req, res: Res, next: Next) {
    updatePermission(req, res, next);
  }

  /**
   * Delete Permission
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async deletePermission(req: Req, res: Res, next: Next) {
    deletePermission(req, res, next);
  }

  /**
   * Restore Permission
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async restorePermission(req: Req, res: Res, next: Next) {
    restorePermission(req, res, next);
  }
}
