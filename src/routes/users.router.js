import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import { isAuthorize, isPremium, isAdmin } from '../middlewares/adminUser.middlewares.js';



const router = Router();

router.get('/premium', isPremium, usersController.premium);

router.post('/premium/roles', isAuthorize, usersController.infoRole);

router.get('/premium/change-role', isAuthorize, usersController.changeRole)




export default router;