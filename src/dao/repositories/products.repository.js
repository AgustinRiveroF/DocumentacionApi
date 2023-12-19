import { productManager } from '../managers/product.dao.js';

class ProductsRepository {
  async getAll(options = {}) {
    return productManager.findAll(options);
  }

  async getById(productId) {
    return productManager.findOneById(productId);
  }

  async create(productData) {
    return productManager.createOne(productData);
  }

  async deleteById(productId) {
    return productManager.deleteProduct(productId);
  }

  async addToCart(userId, productId, quantity) {
    return productManager.addToCart(userId, productId, quantity);
  }

}

export default new ProductsRepository();
