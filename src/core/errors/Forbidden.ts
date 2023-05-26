import BaseError from './BaseError';
import { StatusCode } from '../../types/enum';

export class Forbidden extends BaseError {
  constructor(message?: string) {
    super(StatusCode.FORBIDDEN, true, message);
  }
}
