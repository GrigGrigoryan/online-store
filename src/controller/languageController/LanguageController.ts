import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { getLanguage } from './getLanguage';
import { listLanguages } from './listLanguages';
import { createLanguage } from './createLanguage';
import { updateLanguage, updateLanguageFont } from './updateLanguage';
import { deleteLanguage, restoreLanguage } from './deleteLanguage';

export class LanguageController {
  /**
   * Get language by ID
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async getLanguage(req: Req, res: Res, next: Next) {
    getLanguage(req, res, next);
  }

  /**
   * List languages
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async listLanguages(req: Req, res: Res, next: Next) {
    listLanguages(req, res, next);
  }

  /**
   * Create a new language
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async createLanguage(req: Req, res: Res, next: Next) {
    createLanguage(req, res, next);
  }

  /**
   * Update language
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async updateLanguage(req: Req, res: Res, next: Next) {
    updateLanguage(req, res, next);
  }

  /**
   * Delete language
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async deleteLanguage(req: Req, res: Res, next: Next) {
    deleteLanguage(req, res, next);
  }

  /**
   * Restore language
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async restoreLanguage(req: Req, res: Res, next: Next) {
    restoreLanguage(req, res, next);
  }

  /**
   * Update language font
   * @param req Request
   * @param res Response
   * @param next
   */
  public static async updateLanguageFont(req: Req, res: Res, next: Next) {
    updateLanguageFont(req, res, next);
  }
}
