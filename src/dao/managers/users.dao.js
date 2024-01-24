import { usersModel } from "../models/users.model.js";
import { hashData, compareData,  } from "../../utils/utils.js";

class UsersManager {
    async findById(id) {
        const response = await usersModel.findById(id);
        return response;
    }
    async findByEmail(email){
        const response = await usersModel.findOne({ email });
        return response;
    }    
    async createOne(obj) {
        const response = await usersModel.create(obj);
        return response;
    }
    async resetPassword(email, newPassword) {
        try {
            const user = await usersModel.findOne({ email });

            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            const hashedPassword = await hashData(newPassword);
            user.password = hashedPassword;
        
            await user.save();

            return { success: true, message: "Contraseña restablecida exitosamente" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    async updateUserRole(userId, newRole) {
        try {
          const user = await usersModel.findById(userId);
      
          if (!user) {
            throw new Error('Usuario no encontrado');
          }
      
          user.role = newRole;
      
          await user.save();

        } catch (error) {
          throw new Error(`Errorrr al actualizar el rol del usuario: ${error.message}`);
        }
      }
      
}

export const usersManager = new UsersManager();