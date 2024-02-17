import { Router } from "express";
import { usersManager } from "../dao/managers/users.dao.js";
import '../passport.js'
import { usersModel } from "../dao/models/users.model.js";

const router = Router();

router.get("/", async (req, res) => {

    const { id } = req.session.passport.user;
    const userId = id;

    const email = req.session.passport.user.email;

    if(email === 'adminCoder@coder.com'){
        return res.redirect('/views/login')
    }
    

    await usersManager.logoutUser(userId);

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

