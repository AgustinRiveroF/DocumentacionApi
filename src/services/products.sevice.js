import { productManager } from '../dao/managers/product.dao.js';
import { productModel } from '../dao/models/product.model.js';
import { cartsModel } from '../dao/models/cart.models.js';
import { usersModel } from '../dao/models/users.model.js';
import productsRepository from '../dao/repositories/products.repository.js';

const productsService = {
  getProducts: async (options) => {
    return productsRepository.getAll(options);
  },

  getProductById: async (productId) => {
    return productsRepository.getById(productId);
  },

  createProduct: async (productData) => {
    return productsRepository.create(productData);
  },

  deleteProduct: async (productId) => {
    return productsRepository.deleteById(productId);
  },

  addToCart: async (userId, productId, quantity) => {
    return productsRepository.addToCart(userId, productId, quantity);
  },
};

export default productsService;
