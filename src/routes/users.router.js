import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import usersService from '../services/user.service.js';
import { isAuthorize, isPremium, isAdmin } from '../middlewares/adminUser.middlewares.js';
import upload from '../middlewares/multer.middleware.js';



const router = Router();

// Roles
router.get('/premium', isPremium, usersController.premium);
router.post('/premium/roles', isAuthorize, usersController.infoRole);
router.get('/premium/change-role', isAuthorize, usersController.changeRole)

//Documentation

router.post('/documents',
 upload.fields([
    {name: 'dni', maxCount: 1},
    {name: 'address', maxCount: 1},
    {name: 'bank', maxCount: 1},
]),
    usersController.documents
);



export default router;