import BaseError from './BaseError';
import { StatusCode } from '../../types/enum';

export class Conflict extends BaseError {
  constructor(message?: string) {
    super(StatusCode.CONFLICT, true, message);
  }
}
