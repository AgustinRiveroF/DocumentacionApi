import { Router } from 'express';
import viewsController from '../controllers/views.controller.js';
import { isAuthorize, isPremium, isAdmin } from '../middlewares/adminUser.middlewares.js';
import { sessionInfo } from '../middlewares/session.middleware.js';

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

router.get('/admin/products', isAdmin, viewsController.adminProducts);
router.get('/admin/users', isAdmin, viewsController.usersActivity);
router.get('/admin/change-roles', isAdmin, viewsController.changeRoles );
router.get('/admin/orders', isAdmin, viewsController.orders);
router.post('/admin/orders/delete/:ti', isAdmin, viewsController.deleteOrders);

export default router;
