import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { getCategory } from './getCategory';
import { listCategories } from './listCategories';
import { createCategory } from './createCategory';
import { updateCategory } from './updateCategory';
import { deleteCategory, restoreCategory } from './deleteCategory';

export class CategoryController {
  /**
   * Get category by ID
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async getCategory(req: Req, res: Res, next: Next) {
    getCategory(req, res, next);
  }

  /**
   * List categories
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async listCategories(req: Req, res: Res, next: Next) {
    listCategories(req, res, next);
  }

  /**
   * Create a new category
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async createCategory(req: Req, res: Res, next: Next) {
    createCategory(req, res, next);
  }

  /**
   * Update category
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async updateCategory(req: Req, res: Res, next: Next) {
    updateCategory(req, res, next);
  }

  /**
   * Delete category
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async deleteCategory(req: Req, res: Res, next: Next) {
    deleteCategory(req, res, next);
  }

  /**
   * Restore category
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async restoreCategory(req: Req, res: Res, next: Next) {
    restoreCategory(req, res, next);
  }
}
