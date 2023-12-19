import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import { isAdmin } from "../middlewares/adminUser.middlewares.js";

const router = Router();


// Endpoints Backend && Endpoint protegidos por roles 

router.post("/admin/add-product", isAdmin ,adminController.addProduct);
router.put("/update-product/:productId", isAdmin ,adminController.updateProduct);
router.post("/update-product", isAdmin ,adminController.updateProductWithId);
router.post("/delete-product", isAdmin ,adminController.deleteProduct);

export default router;
