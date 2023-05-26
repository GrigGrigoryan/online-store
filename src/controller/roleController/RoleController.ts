import { NextFunction as Next, Request as Req, Response as Res } from 'express';
import { getRole } from './getRole';
import { createRole } from './createRole';
import { listRoles } from './listRoles';
import { updateRole } from './updateRole';
import { deleteRole, restoreRole } from './deleteRole';

export class RoleController {
  /**
   * Get Role
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async getRole(req: Req, res: Res, next: Next) {
    getRole(req, res, next);
  }

  /**
   * List Roles
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async listRoles(req: Req, res: Res, next: Next) {
    listRoles(req, res, next);
  }

  /**
   * Create a new Role
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async createRole(req: Req, res: Res, next: Next) {
    createRole(req, res, next);
  }

  /**
   * Update Role
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async updateRole(req: Req, res: Res, next: Next) {
    updateRole(req, res, next);
  }

  /**
   * Delete Role
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async deleteRole(req: Req, res: Res, next: Next) {
    deleteRole(req, res, next);
  }

  /**
   * Restore Role
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async restoreRole(req: Req, res: Res, next: Next) {
    restoreRole(req, res, next);
  }
}
