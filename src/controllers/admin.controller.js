import adminService from "../services/admin.service.js";

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
    try {
      const deletedProduct = await adminService.deleteProduct(req.body.productId);
      res.status(200).json({ message: "Producto eliminado exitosamente", product: deletedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno al eliminar producto" });
    }
  },
};

export default adminController;
