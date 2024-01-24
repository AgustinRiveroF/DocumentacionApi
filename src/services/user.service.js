import { logger } from "../utils/logger.js";
import { usersManager } from "../dao/managers/users.dao.js";



const usersService = {
    infoRole: async (req, res) => {
        try {
            const userId = req.body.idUser;
            const newRole = req.body.newRole;
        

            const user = await usersManager.updateUserRole(userId, newRole);
        
            res.send('Rol actualizado exitosamente');
          } catch (error) {
            console.error("Error al actualizar el rol del usuario:", error);
        
            res.send('Error interno del servidor');
          }
    },

    changeRole: (req, res) => {
        res.render('changerole')
    },

    premium: (req, res) => {
        res.render('premium')
    },
    
    
};

export default usersService;    