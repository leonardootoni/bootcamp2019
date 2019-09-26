import 'dotenv/config';
import express from 'express';
import * as Sentry from '@sentry/node';
import 'express-async-errors'; // It has to be imported before the app routes.
import Youch from 'youch';

import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import sentryConfig from './config/sentry';

import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig); // It must be loaded after everything else

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // The request handler must be the first middleware on the app
    this.server.use(Sentry.Handlers.requestHandler());

    this.server.use(helmet());
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }

  /**
   * Load a general exception handler middleware to intercept all application
   * errors. It makes use of express-async-errors lib.
   */
  exceptionHandler() {
    /**
     * Sentry Error Handler middleware. It must be loaded after all routes.
     */
    this.server.use(Sentry.Handlers.errorHandler());

    /**
     * General Application Exception Handler. It will intercept all application
     * exceptions and respond a JSON statck trace wrapped into a http 500 error
     * response body for all not handled exceptions.
     */
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        // Convert a error stacktrace into JSON format.
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status.json({ error: 'Internal server error.' });
    });
  }
}

export default new App().server;
