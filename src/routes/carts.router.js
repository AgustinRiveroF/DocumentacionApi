// cart.router.js
import { Router } from "express";
import cartController from "../controllers/carts.controller.js";
import ticketService from '../services/ticket.service.js';
import { isAuthenticated } from "../middlewares/autheticate.middleware.js";
import passport from "passport";
import { addToCart } from "../middlewares/adminUser.middlewares.js";

 


const router = Router();

router.get("/", cartController.getAllCarts);
router.get('/my-cart', cartController.getMyCart);
router.get("/:idCart", cartController.getCartById);
router.get("/populated/:cid", cartController.getPopulatedCart);

router.post("/", cartController.createCart);
router.post('/:cid/purchase', cartController.finalizePurchase);
router.post("/:cid/products/:pid", addToCart, cartController.addProductToCart);
router.post("/:cartId/add-product", addToCart, cartController.addProductToCartWithId);

router.put("/:cid", cartController.updateCart);
router.put("/:cid/products/:pid", cartController.updateProductQuantity);

router.delete("/:cid", cartController.clearCart);
router.delete("/:cid/products/:pid", cartController.removeProductFromCart);


export default router;
