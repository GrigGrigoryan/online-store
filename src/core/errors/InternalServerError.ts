import BaseError from './BaseError';
import { StatusCode } from '../../types/enum';

export class InternalServerError extends BaseError {
  constructor(message: string) {
    super(StatusCode.INTERNAL_SERVER_ERROR, true, message);
  }
}
