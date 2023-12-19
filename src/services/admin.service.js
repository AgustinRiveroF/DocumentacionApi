import { productManager } from "../dao/managers/product.dao.js";

const adminService = {
  addProduct: async ({ product_name, product_price, product_description, stock }) => {
    if (!product_name || !product_price || !product_description || !stock) {
      throw new Error("Todos los campos son obligatorios");
    }

    const newProduct = await productManager.createOne({
      product_name,
      product_price,
      product_description,
      stock,
    });

    return newProduct;
  },

  updateProduct: async (productId, { newProductName, newProductPrice, newProductDescription }) => {
    if (!productId || !newProductName) {
      throw new Error("Se requiere un ID de producto y un nuevo nombre");
    }

    const updatedProduct = await productManager.updateProduct(productId, {
      product_name: newProductName,
      product_price: newProductPrice,
      product_description: newProductDescription,
    });

    if (!updatedProduct) {
      throw new Error("Producto no encontrado");
    }

    return updatedProduct;
  },

  updateProductWithId: async (productIdToUpdate, { newProductName, newProductPrice, newProductDescription }) => {
    if (!productIdToUpdate || !newProductName) {
      throw new Error("Se requiere un ID de producto a actualizar y un nuevo nombre");
    }

    const updatedProduct = await productManager.updateProduct(productIdToUpdate, {
      product_name: newProductName,
      product_price: newProductPrice,
      product_description: newProductDescription,
    });

    if (!updatedProduct) {
      throw new Error("Producto no encontrado");
    }

    return updatedProduct;
  },

  deleteProduct: async (productId) => {
    if (!productId) {
      throw new Error("Se requiere un ID de producto válido");
    }

    const deletedProduct = await productManager.deleteProduct(productId);

    if (!deletedProduct) {
      throw new Error("Producto no encontrado");
    }

    return deletedProduct;
  },
};

export default adminService;
