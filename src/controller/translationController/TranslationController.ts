import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { getTranslation } from './getTranslation';
import { listTranslations } from './listTranslations';
import { createTranslation } from './createTranslation';
import { updateTranslation } from './updateTranslation';
import { deleteTranslation, restoreTranslation } from './deleteTranslation';

export class TranslationController {
  /**
   * Get translation
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async getTranslation(req: Req, res: Res, next: Next) {
    getTranslation(req, res, next);
  }

  /**
   * List translations
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async listTranslations(req: Req, res: Res, next: Next) {
    listTranslations(req, res, next);
  }

  /**
   * Create a new translation
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async createTranslation(req: Req, res: Res, next: Next) {
    createTranslation(req, res, next);
  }

  /**
   * Update translation
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async updateTranslation(req: Req, res: Res, next: Next) {
    updateTranslation(req, res, next);
  }

  /**
   * Delete translation
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async deleteTranslation(req: Req, res: Res, next: Next) {
    deleteTranslation(req, res, next);
  }

  /**
   * Restore translation
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async restoreTranslation(req: Req, res: Res, next: Next) {
    restoreTranslation(req, res, next);
  }
}
