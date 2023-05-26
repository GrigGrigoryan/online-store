import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { getItem } from './getItem';
import { listItems } from './listItems';
import { createItem } from './createItem';
import { updateItem, uploadItemImage } from './updateItem';
import { deleteItem, restoreItem } from './deleteItem';

export class ItemController {
  /**
   * Get Item by ID
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async getItem(req: Req, res: Res, next: Next) {
    getItem(req, res, next);
  }

  /**
   * List Items
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async listItems(req: Req, res: Res, next: Next) {
    listItems(req, res, next);
  }

  /**
   * Create a new Item
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async createItem(req: Req, res: Res, next: Next) {
    createItem(req, res, next);
  }

  /**
   * Update Item
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async updateItem(req: Req, res: Res, next: Next) {
    updateItem(req, res, next);
  }

  /**
   * Delete Item
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async deleteItem(req: Req, res: Res, next: Next) {
    deleteItem(req, res, next);
  }

  /**
   * Restore Item
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async restoreItem(req: Req, res: Res, next: Next) {
    restoreItem(req, res, next);
  }

  /**
   * Upload item image
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async uploadItemImage(req: Req, res: Res, next: Next) {
    uploadItemImage(req, res, next);
  }
}
