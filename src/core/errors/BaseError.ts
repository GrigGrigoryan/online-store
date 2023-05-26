import { StatusCode } from '../../types/enum';

export default class BaseError extends Error {
  private statusCode: StatusCode;
  private description: string;
  private status: string;
  public isOperational: boolean;

  constructor(statusCode: StatusCode, isOperational: boolean, message?: string, description?: string) {
    super(message);

    this.statusCode = statusCode;
    this.description = description;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
