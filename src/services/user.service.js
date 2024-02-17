import { logger } from "../utils/logger.js";
import { usersManager } from "../dao/managers/users.dao.js";
import { usersModel } from "../dao/models/users.model.js";



const usersService = {
    infoRole: async (req, res) => {
        try {
            const userId = req.body.idUser;
            const newRole = req.body.newRole;
            
            const userData = await usersModel.findById(userId);
            const approvedUser = userData.documents;

            console.log("Este es el aprovedUser", approvedUser);

            if(!approvedUser || approvedUser.length === 0){
                res.send('Aun no envio la documentacion')
            }else{
                const user = await usersManager.updateUserRole(userId, newRole);
                res.send('Rol actualizado exitosamente');
            }
            

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

    documents: async (req, res, dni, address, bank) => {
        const  id  = req.id;
        const savedDocuments = await usersManager.updateOne(id, {
            documents: [
                {
                    name: 'dni',
                    reference:req.dni[0].path,
                },
                {
                    name: 'address',
                    reference:req.address[0].path,
                },
                {
                    name: 'bank',
                    reference:req.bank[0].path,
                },
            ],
        });
        return savedDocuments;
    }, 
};

export default usersService;    