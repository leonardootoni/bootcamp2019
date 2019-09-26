import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import auth from './app/middlewares/auth';
import pagination from './app/middlewares/pagination';

import AppointmentController from './app/controllers/AppointmentController';
import AvailableController from './app/controllers/AvailableController';
import FileController from './app/controllers/FileController';
import NotificationController from './app/controllers/NotificationController';
import ProviderController from './app/controllers/ProviderController';
import ScheduleControler from './app/controllers/ScheduleController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

const routes = new Router();
const upload = multer(multerConfig);

/** Not protected Routes */
routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

/** Application Middlewares */
routes.use(auth);
routes.use(pagination);

/** Protected Routes */
routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);
routes.post('/files', upload.single('file'), FileController.store);
routes.get('/notifications', NotificationController.index);
routes.post('/notifications', NotificationController.store);
routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);
routes.get('/schedule', ScheduleControler.index);
routes.put('/users', UserController.update);

export default routes;
