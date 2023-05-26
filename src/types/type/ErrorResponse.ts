import { StatusCode } from '../enum';

export type ErrorResponse = {
  statusCode: StatusCode;
  status: string;
  message: string;
  stack: string;
  description: string;
  isOperational: boolean;
};
