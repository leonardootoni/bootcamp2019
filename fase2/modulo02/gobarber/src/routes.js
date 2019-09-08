import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import auth from './app/middlewares/auth';

import AppointmentController from './app/controllers/AppointmentController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

const routes = new Router();
const upload = multer(multerConfig);

/** Not protected Routes */
routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

/** Security Middleware */
routes.use(auth);

/** Protected Routes */
routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.post('/files', upload.single('file'), FileController.store);
routes.put('/users', UserController.update);
routes.get('/providers', ProviderController.index);

export default routes;
