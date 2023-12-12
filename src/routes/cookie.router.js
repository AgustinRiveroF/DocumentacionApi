// cookie.router.js
import { Router } from 'express';
import cookieController from '../controllers/cookie.controller.js';

const router = Router();

router.post('/', cookieController.setSession);

router.get('/view', cookieController.viewCookie);

export default router;
