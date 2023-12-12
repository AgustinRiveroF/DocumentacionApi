import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';

const router = Router();

router.get('/get-user', sessionsController.getUser);

router.post('/signup', sessionsController.signup);

router.post('/login', sessionsController.login);

router.get('/auth/github', sessionsController.githubAuth);

router.get('/callback', sessionsController.githubCallback);

router.get('/current', sessionsController.getCurrentUser);

export default router;
