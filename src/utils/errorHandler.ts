import Logger from '../core/Logger';
import { Response } from 'express';
import { StatusCode } from '../types/enum';
import { ErrorResponse } from '../types/type';

export const sendErrorLocal = (err: ErrorResponse, res: Response) => {
  res.status(err.statusCode).send({
    message: err.message,
    description: err.description,
    isOperational: err.isOperational,
    stack: err.stack,
  });
};

export const sendErrorDev = (err: ErrorResponse, res: Response) => {
  res.status(err.statusCode).send({
    message: err.message,
    description: err.description,
  });
};

export const sendErrorStage = (err: ErrorResponse, res: Response) => {
  if (err.isOperational) {
    // Operational, trusted error: send message to client
    res.status(err.statusCode).send({
      message: err.message,
      description: err.description,
    });
  } else {
    // Programming or other unknown error
    Logger.error('ERROR 💥: ', err);

    // await sendMailToAdminIfCritical();
    // await sendEventsToSentry();

    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      message: 'Something went very wrong!',
    });
  }
};

export const sendErrorProd = (err: ErrorResponse, res: Response) => {
  if (err.isOperational) {
    // Operational, trusted error: send message to client
    res.status(err.statusCode).send({
      message: err.message,
    });
  } else {
    // Programming or other unknown error
    Logger.error('ERROR 💥: ', err);

    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      message: 'Something went very wrong!',
    });
  }
};
