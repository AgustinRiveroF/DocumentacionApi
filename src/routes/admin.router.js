import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import { isAdmin , isAuthorize, modifyProduct } from "../middlewares/adminUser.middlewares.js";

const router = Router();


// Endpoints protegidos por roles 

router.post("/admin/add-product", isAuthorize, modifyProduct, adminController.addProduct);
router.put("/update-product/:productId", isAuthorize, modifyProduct, adminController.updateProduct);
router.post("/update-product", isAuthorize ,modifyProduct , adminController.updateProductWithId);
router.post("/delete-product", isAuthorize ,modifyProduct, adminController.deleteProduct);

export default router;
