// cart.router.js
import { Router } from "express";
import cartController from "../controllers/carts.controller.js";
import { addToCart } from "../middlewares/adminUser.middlewares.js";
import { sessionInfo } from "../middlewares/session.middleware.js";
import { isAuthorize, isPremium, isAdmin } from '../middlewares/adminUser.middlewares.js';

const router = Router();

router.get("/", isAuthorize, sessionInfo, cartController.getAllCarts);
router.get('/my-cart', sessionInfo, cartController.getMyCart);
router.get("/:idCart", cartController.getCartById);
router.get("/populated/:cid", cartController.getPopulatedCart);

router.post("/", cartController.createCart);
router.post('/:cid/purchase', cartController.finalizePurchase);
router.post("/:cid/products/:pid", addToCart, cartController.addProductToCart);
router.post("/:cartId/add-product", addToCart, cartController.addProductToCartWithId);

router.post("/:cid/product/:pid", cartController.removeProductFromCart);

router.put("/:cid", cartController.updateCart);
router.put("/:cid/products/:pid", cartController.updateProductQuantity);

router.delete("/:cid", cartController.clearCart);
router.delete("/:cid/products/:pid", cartController.removeProductFromCart);


export default router;
