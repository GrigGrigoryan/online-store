import BaseError from './BaseError';
import { StatusCode } from '../../types/enum';

export class Unauthorized extends BaseError {
  constructor(message?: string) {
    super(StatusCode.UNAUTHORIZED, true, message);
  }
}
