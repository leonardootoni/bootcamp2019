import { Router } from 'express';

import authValidator from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

// Application routes file
const routes = new Router();

/** ***************************************************************************
 * Unprotected routes goes here
 * ************************************************************************** */
routes.post('/auth', SessionController.store);
routes.post('/users', UserController.store);

/** ***************************************************************************
 * Security Route Middleware
 * ************************************************************************** */
routes.use(authValidator.checkToken);

/** ***************************************************************************
 * Protected routes goes here
 * ************************************************************************** */
routes.put('/users/:id/updatePassword', UserController.update);

export default routes;
