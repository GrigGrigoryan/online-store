import winston from 'winston';
import 'winston-daily-rotate-file';
import { NodeEnv } from '../types/enum';
import { envConfig } from '../config';
import { LoggerColor } from '../types/enum/LoggerColor';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const maxPrintLevel = () => {
  const env: NodeEnv = envConfig.nodeEnv;
  const isDevelopment: boolean = env === NodeEnv.LOCAL || env === NodeEnv.DEV;
  return isDevelopment ? 'silly' : 'http';
};

const colors = {
  http: LoggerColor.BLUE,
  info: LoggerColor.GREEN,
  debug: LoggerColor.MAGENTA,
  warn: LoggerColor.YELLOW,
  error: LoggerColor.RED,
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.errors({ stack: true }),
  winston.format.align(),
  winston.format.prettyPrint(),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format,
  }),
  new winston.transports.File({
    filename: 'logs/info.log',
    level: 'info',
    format,
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
];

const Logger: any = winston.createLogger({
  level: maxPrintLevel(),
  levels,
  format,
  transports,
  exitOnError: false,
  exceptionHandlers: [new winston.transports.File({ filename: 'logs/exception.log' })],
  rejectionHandlers: [new winston.transports.File({ filename: 'logs/rejection.log' })],
});

export default Logger;
