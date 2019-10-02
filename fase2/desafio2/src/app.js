import 'dotenv/config';
import { resolve } from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'express-async-errors'; // It has to be imported before app routes
import Youch from 'youch';

import './database';
import routes from './routes';

/**
 * Represents an instance of an Expressjs application with its respective
 * middlewares and routes.
 */
class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  // Define all application middlewares
  middlewares() {
    // enable secure response http headers
    this.server.use(helmet());
    this.server.use(cors());

    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  // define the application main routes file
  routes() {
    this.server.use(routes);
  }

  /**
   * General Application Exception Handler.
   */
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        // Convert a error stacktrace into JSON format.
        console.log(err);
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error.' });
    });
  }
}

export default new App().server;
