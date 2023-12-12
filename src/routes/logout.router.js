/* // logout.router.js
import { Router } from 'express';
import logoutController from '../controllers/logout.controller.js';

const router = Router();

router.get('/', logoutController.logoutUser);

export default router; */

import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al destruir la sesión:", err);
            res.status(500).json({ status: "error", message: "Error al cerrar sesión" });
        } else {
            res.redirect("/views/login");
        }
    });
});

export default router

