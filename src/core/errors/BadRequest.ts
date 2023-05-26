import BaseError from './BaseError';
import { StatusCode } from '../../types/enum';

export class BadRequest extends BaseError {
  constructor(message?: string, description?: string) {
    super(StatusCode.BAD_REQUEST, true, message, description);
  }
}
