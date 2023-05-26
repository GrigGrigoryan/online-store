import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { getTag } from './getTag';
import { listTags } from './listTags';
import { createTag } from './createTag';
import { updateTag } from './updateTag';
import { deleteTag, restoreTag } from './deleteTag';

export class TagController {
  /**
   * Get tag by ID
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async getTag(req: Req, res: Res, next: Next) {
    getTag(req, res, next);
  }

  /**
   * List tags
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async listTags(req: Req, res: Res, next: Next) {
    listTags(req, res, next);
  }

  /**
   * Create a new tag
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async createTag(req: Req, res: Res, next: Next) {
    createTag(req, res, next);
  }

  /**
   * Update tag
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async updateTag(req: Req, res: Res, next: Next) {
    updateTag(req, res, next);
  }

  /**
   * Delete tag
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async deleteTag(req: Req, res: Res, next: Next) {
    deleteTag(req, res, next);
  }

  /**
   * Restore tag
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async restoreTag(req: Req, res: Res, next: Next) {
    restoreTag(req, res, next);
  }
}
