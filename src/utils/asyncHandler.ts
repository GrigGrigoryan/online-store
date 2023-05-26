import { Request as Req, Response as Res, NextFunction as Next, RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';

export const asyncHandler = (fn: RequestHandler) => {
  return expressAsyncHandler(async (req: Req, res: Res, next: Next) => {
    return fn(req, res, next);
  });
};
