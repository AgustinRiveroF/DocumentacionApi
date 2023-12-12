import { Router } from "express";
import adminController from "../controllers/admin.controller.js";

const router = Router();

// Endpoints Frontend

/* router.get("/", (req, res) =>{
    res.render("admin")
}); */


// Endpoints Backend
router.post("/admin/add-product", adminController.addProduct);
router.put("/update-product/:productId", adminController.updateProduct);
router.post("/update-product", adminController.updateProductWithId);
router.post("/delete-product", adminController.deleteProduct);

export default router;
