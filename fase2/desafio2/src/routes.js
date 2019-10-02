import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authValidator from './app/middlewares/auth';
import pagination from './app/middlewares/pagination';

import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SessionController from './app/controllers/SessionController';
import SubscriptionController from './app/controllers/SubscriptionController';
import UserController from './app/controllers/UserController';

/** ***************************************************************************
 *  Instance configuration
 * ************************************************************************** */
const routes = new Router();
const upload = multer(multerConfig);

/** ***************************************************************************
 * Unprotected routes goes here
 * ************************************************************************** */
routes.post('/auth', SessionController.store);
routes.post('/users', UserController.store);

/** ***************************************************************************
 * Security Route Middlewares
 * ************************************************************************** */
routes.use(authValidator.checkToken);
routes.use(pagination);

/** ***************************************************************************
 * Protected routes goes here
 * ************************************************************************** */
routes.get('/files', FileController.index);
routes.post('/files', upload.single('file'), FileController.store);
routes.delete('/meetup/:id', MeetupController.delete);
routes.get('/meetup', MeetupController.index);
routes.post('/meetup', MeetupController.store);
routes.put('/meetup/:id', MeetupController.update);
routes.get('/subscription', SubscriptionController.index);
routes.post('/subscription', SubscriptionController.store);
routes.delete('/subscription/:meetupId', SubscriptionController.delete);
routes.put('/users/:id/updatePassword', UserController.update);

export default routes;
