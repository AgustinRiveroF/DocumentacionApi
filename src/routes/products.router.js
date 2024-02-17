import { Router } from 'express';
import productsController from '../controllers/products.controller.js';
import { sessionInfo } from '../middlewares/session.middleware.js';

const router = Router();

router.get('/', sessionInfo, productsController.getProducts);

router.get('/:pid', sessionInfo, productsController.getProductById);

router.post('/', sessionInfo, productsController.createProduct);

router.post('/:pid/add-to-cart', sessionInfo, productsController.addToCart);

router.delete('/:productId', sessionInfo, productsController.deleteProduct);

export default router;
