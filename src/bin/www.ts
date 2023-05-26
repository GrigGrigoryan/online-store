#!/usr/bin/env node

/**
 * Module dependencies.
 */

import http from 'http';
import app from '../app';
import Logger from '../core/Logger';
import { Server as httpServer } from 'http';
import { Server as httpsServer } from 'https';
import { Port } from '../types/type';
import { ErrorCode, NodeEnv } from '../types/enum';
import { envConfig } from '../config';

/**
 * Create HTTP/HTTPS server.
 */

let server: httpsServer | httpServer;

server = http.createServer(app);

/**
 * Get port from environment and store in Express.
 */

const port: Port = normalizePort(envConfig.port);
app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

process
  .on('unhandledRejection', (reason: {}, p: any) => {
    Logger.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err: Error) => {
    Logger.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const portNum: Port = parseInt(val, 10);

  if (isNaN(portNum)) {
    // named pipe
    return val;
  }

  if (portNum >= 0) {
    // port number
    return portNum;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case ErrorCode.EACCESS:
      Logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case ErrorCode.EADDRINUSE:
      Logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind: string = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  Logger.http('Listening on ' + bind);
}
