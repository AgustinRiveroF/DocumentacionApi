// cart.router.js
import { Router } from "express";
import cartController from "../controllers/carts.controller.js";

const router = Router();

// Define tus rutas utilizando las funciones del controlador
router.get("/populated/:cid", cartController.getPopulatedCart);
router.get("/:idCart", cartController.getCartById);
router.get("/", cartController.getAllCarts);
router.post("/", cartController.createCart);
router.post("/:cid/products/:pid", cartController.addProductToCart);
router.post("/:cid/add-product", cartController.addProductToCartWithId);
router.put("/:cid", cartController.updateCart);
router.put("/:cid/products/:pid", cartController.updateProductQuantity);
router.delete("/:cid", cartController.clearCart);
router.delete("/:cid/products/:pid", cartController.removeProductFromCart);

export default router;
