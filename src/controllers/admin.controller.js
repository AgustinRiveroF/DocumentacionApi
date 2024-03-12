import { usersManager } from "../dao/managers/users.dao.js";
import { usersModel } from "../dao/models/users.model.js";
import adminService from "../services/admin.service.js";
import { transporter } from "../utils/nodemailer.js";


const adminController = {
  addProduct: async (req, res) => {
    try {
      const newProduct = await adminService.addProduct(req.body);
      return res.render("admin", { Message: 'Producto Agregado', newProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno al agregar producto" });
    }
  },
  
  updateProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      const updatedProduct = await adminService.updateProduct(productId, req.body);
      res.status(200).json({ message: "Producto actualizado exitosamente", product: updatedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno al actualizar producto" });
    }
  },

  updateProductWithId: async (req, res) => {
    try {
      const updatedProduct = await adminService.updateProductWithId(req.body.productIdToUpdate, req.body);
      res.status(200).json({ message: "Producto actualizado exitosamente", product: updatedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno al actualizar producto" });
    }
  },

  deleteProduct: async (req, res) => {
    const { id } = req.session.passport.user;
    const userId = id;
    try {
      const user = await usersModel.findById(userId);
      const deletedProduct = await adminService.deleteProduct(req.body.productId);

      const ownerProduct = deletedProduct.owner;
      const productDeleted = deletedProduct.product_name;

      const mailOptions = {
        from: 'Hamburgueseria',
        to: ownerProduct,
        subject: `Eliminación de producto`,
        html: `<h1>Hola ${user.first_name} ${user.last_name}!</h1><p>Tu producto <b>${productDeleted}</b> ha sido eliminado.</p>`,
    };
    await transporter.sendMail(mailOptions);


      res.status(200).json({ message: "Producto eliminado exitosamente", product: deletedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno al eliminar producto" });
    }
  },
};

export default adminController;
