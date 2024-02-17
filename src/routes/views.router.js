import { Router } from 'express';
import viewsController from '../controllers/views.controller.js';

const router = Router();

router.get('/loggerTest', viewsController.loggerTest);

router.get('/login', viewsController.renderLogin,);

router.get('/signup', viewsController.renderSignup);

router.get('/profile', viewsController.renderProfile);

router.get('/forgottenPassword', viewsController.forgottenPassword);

router.get('/recoverPasswordWithEmail', viewsController.recoverPasswordWithEmail);

router.post('/recoverPassword', viewsController.recoverPassword);

router.post('/ahorasi', viewsController.ahorasi);

router.get('/documents', viewsController.documents);

export default router;
