// products.service.js
import { productManager } from '../daos/managers/product.dao.js';

const productsService = {
  getProducts: async (options) => {
    let products;

    if (options.sort === 'asc') {
      products = await productManager.findAllSortedAscending(options);
    } else if (options.sort === 'desc') {
      products = await productManager.findAllSortedDescending(options);
    } else {
      products = await productManager.findAll(options);
    }

    return products;
  },

  getProductById: async (productId) => {
    return await productManager.findOneById(productId);
  },

  createProduct: async (productData) => {
    return await productManager.createOne(productData);
  },

  deleteProduct: async (productId) => {
    return await productManager.deleteProduct(productId);
  },
};

export default productsService;
