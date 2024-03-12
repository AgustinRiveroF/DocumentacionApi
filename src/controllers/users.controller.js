import mongoose from "mongoose";
import usersService from "../services/user.service.js";
import { usersModel } from "../dao/models/users.model.js"
import { transporter } from "../utils/nodemailer.js";

const usersController = {

    infoRole: async (req, res) => {
        try {
            const userId = req.body.idUser;
            const newRole = req.body.newRole;

            const userData = await usersModel.findById(userId);
            const approvedUser = userData.documents;

            console.log("Este es el aprovedUser", approvedUser);

            if (!approvedUser || approvedUser.length === 0) {
                res.send('Aun no envio la documentacion')
            } else {
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

    documents: async (req, res) => {
        const { id } = req.body;
        console.log(req.files);
        const { dni, address, bank } = req.files;
        const response = await usersService.documents({ id, dni, address, bank });
        res.render("documents")
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await usersModel.find({});
            if (users && users.length > 0) {
                const totalUsers = users.map(user => ({
                    first_name: user.first_name,
                    email: user.email,
                    role: user.role
                }));
                res.json(totalUsers);
            } else {
                res.status(404).json({ message: 'No users found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    inactiveUsers: async (req, res) => {
        const { first_name, last_name, email } = req.body;
        const id = '65d06bf5f18bf2c9583d5475';
        const userId = id;

        try {
            const user = await usersModel.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const dateLimit = new Date(Date.now() - 30 * 60 * 1000); // Hace 30 minutos
            //const dateLimit = new Date(Date.now() - 5 * 60 * 1000);// Hace 5 minutos

            const result = await usersModel.deleteMany({
                last_connection: { $lt: dateLimit }
            });

            const deletedCount = result.deletedCount;

            if (deletedCount > 0) {
                const mailOptions = {
                    from: 'Hamburgueseria',
                    to: user.email,
                    subject: `Eliminación de cuenta por inactividad`,
                    html: `<h1>Hola ${user.first_name} ${user.last_name}!</h1><p>Tu cuenta ha sido eliminada por inactividad.</p>`,
                };
                await transporter.sendMail(mailOptions);

                console.log(`${deletedCount} usuarios eliminados.`);
                res.json({ message: `${deletedCount} usuarios eliminados.` });
            } else {
                console.log('No hay usuarios inactivos para eliminar.');
                res.json({ message: 'No hay usuarios inactivos para eliminar.' });
            }
        } catch (error) {
            console.error('Error al eliminar usuarios inactivos:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

};


export default usersController;