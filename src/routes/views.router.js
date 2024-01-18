import { Router } from 'express';
import viewsController from '../controllers/views.controller.js';

const router = Router();

router.get('/loggerTest', viewsController.loggerTest);

router.get('/login', viewsController.renderLogin,);

router.get('/signup', viewsController.renderSignup);

router.get('/profile', viewsController.renderProfile);

export default router;
