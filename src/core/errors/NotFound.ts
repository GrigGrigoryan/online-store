import BaseError from './BaseError';
import { StatusCode } from '../../types/enum';

export class NotFound extends BaseError {
  constructor(message?: string, description?: string) {
    super(StatusCode.NOT_FOUND, true, message, description);
  }
}
