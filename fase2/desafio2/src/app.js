import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

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
  }

  // Define all application middlewares
  middlewares() {
    // enable secure response http headers
    this.server.use(helmet());
    this.server.use(express.json());
    this.server.use(cors());
  }

  // define the application main routes file
  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
