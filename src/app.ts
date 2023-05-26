import express, { Request as Req, Response as Res, NextFunction as Next, Application, Errback } from 'express';
import { Database } from './database';
import { publicRouter, adminRouter, apiRouter } from './routes';
import { NotFound } from './core/errors';
import { sendErrorLocal, sendErrorDev, sendErrorProd, sendErrorStage } from './utils';
import { StatusCode, NodeEnv, Status } from './types/enum';
import { envConfig, dbConfig } from './config';
import { Translate } from './services';
import { authentication, role } from './middlewares/auth';
import { Seeder } from './database/seeds';
import Logger from './core/Logger';
import { ErrorResponse } from './types/type';
import 'reflect-metadata';

(async (): Promise<void> => {
  Logger.info('Initializing Services, Please be patient...');
  await Database.init(dbConfig);
  await Seeder.init();
  await Translate.instance.init();
})()
  .then((res: any) => {
    Logger.info('Services Initialized.');
  })
  .catch((err) => {
    Logger.error(err);
  });

const app: Application = express();
app.options('/*', (req: Req, res: Res, next: Next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Lang, X-Api-Key');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'Authorization');
  res.status(200).send('OK');
});

app.use('/', (req: Req, res: Res, next: Next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Lang, X-Api-Key');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'Authorization');

  next();
});

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('static'));
app.use(express.json());

// Add APIs
app.use('/api', authentication, apiRouter);
app.use('/public', publicRouter);
app.use('/admin', authentication, role, adminRouter);

// Handle undefined endpoint
app.all('*', (req: Req, res: Res, next: Next) => {
  next(new NotFound(`Can't find ${req.method} ${req.originalUrl} on this server!`));
});

// handle Errors
app.use('/', (err: ErrorResponse, req: Req, res: Res, next: Next) => {
  err.statusCode = err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;

  switch (envConfig.nodeEnv) {
    case NodeEnv.LOCAL:
      sendErrorLocal(err, res);
      break;
    case NodeEnv.DEV:
      sendErrorDev(err, res);
      break;
    case NodeEnv.STAGE:
      sendErrorStage(err, res);
      break;
    case NodeEnv.PROD:
      sendErrorProd(err, res);
      break;
  }
});

export default app;
