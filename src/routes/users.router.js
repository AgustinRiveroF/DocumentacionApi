import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import usersService from '../services/user.service.js';
import { isAuthorize, isPremium, isAdmin } from '../middlewares/adminUser.middlewares.js';
import upload from '../middlewares/multer.middleware.js';
import { sessionInfo } from '../middlewares/session.middleware.js';



const router = Router();

// Roles
router.get('/premium', isPremium, sessionInfo, usersController.premium);
router.post('/premium/roles', isAuthorize, sessionInfo, usersController.infoRole);
router.get('/premium/change-role', isAuthorize, sessionInfo, usersController.changeRole);

// Obtener usuarios
router.get('/get-all-users', isAuthorize, sessionInfo, usersController.getAllUsers);

// Eliminar cuenta de usuario por inactividad
router.post('/delete-inactive-users', isAuthorize, sessionInfo, usersController.inactiveUsers);

//Documentation: Solicitud para cambio de rol

router.post('/documents', sessionInfo,
    upload.fields([
        { name: 'dni', maxCount: 1 },
        { name: 'address', maxCount: 1 },
        { name: 'bank', maxCount: 1 },
    ]),
    usersController.documents
);



export default router;