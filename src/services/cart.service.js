import { cartsManager } from '../dao/managers/carts.dao.js';
import { productManager } from '../dao/managers/product.dao.js';
import { cartsModel } from '../dao/models/cart.models.js';
import ticketService from './ticket.service.js';

const cartService = {
  findCartById: async (cid) => {
    const cart = await cartsManager.findCartById(cid);
    return cart;
  },

  getAllCarts: async () => {
    const carts = await cartsManager.getAllCarts();
    return carts;
  },

  createCart: async (userId) => {
    const existingCart = await cartsModel.findOne({ userId });

    if (existingCart) {
      console.log(`El usuario con ID ${userId} ya tiene un carrito.`);
      return existingCart;
    } else {
      const newCart = await cartsManager.createCart(userId);
      console.log(`Se ha creado un nuevo carrito para el usuario con ID ${userId}.`);
      return newCart;
    }
  },

  addProductToCartWithId: async (cid, productId, quantity, product_name, product_description, product_price) => {
    const cart = await cartsManager.addProductToCartWithId(cid, productId, quantity, product_name, product_description, product_price);
    return cart;
  },

  addProductToCart: async (cid, pid) => {
    const cart = await cartsManager.addProductToCart(cid, pid);
    return cart;
  },

  updateCart: async (cartId, updatedCart) => {
    const result = await cartsManager.updateCart(cartId, updatedCart);
    return result;
  },

  updateProductQuantity: async (cid, pid, quantity) => {
    await cartsManager.updateProductQuantity(cid, pid, quantity);
  },

  clearCart: async (cid) => {
    await cartsManager.clearCart(cid);
  },

  removeProductFromCart: async (cid, pid) => {
    await cartsManager.removeProductFromCart(cid, pid);
  },

  processPurchase: async (cartId) => {
    try {
      const failedProducts = [];
      const cart = await cartsModel.findById(cartId);
      const prices = cart.products.product_price;
      const products = cart.products;
      
      let totalAmount = 0;

      for (const cartProduct of products) {
        const product = cartProduct.productId;
        const quantity = cartProduct.quantity;
        const price = cartProduct.product_price;

        if (products) {

          const productTotal = price * quantity;
          totalAmount += productTotal;

        } else {
          const productIdString = product ? product.toString() : 'undefined';
          failedProducts.push(productIdString);
        }
      }
      
      return { success: true, totalAmount, failedProducts };
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      return { success: false, failedProducts: [], error: 'Internal Server Error' };
    }
  },

  async finalizePurchase(cartId) {
    try {
      const cart = await cartsManager.getCartById(cartId);
      const purchaseResult = await cartService.processPurchase(cartId);

      if (purchaseResult.success) {
        const failedProducts = cart.products.filter((cartProduct) => {
          const productIdString = cartProduct.productId?.toString();
          return purchaseResult.failedProducts.includes(productIdString);
        });

        cart.products = failedProducts;
        await cartsManager.updateCart(cartId, cart.toObject());

        return { success: true, totalAmount: purchaseResult.totalAmount };
      } else {
        return { success: false, failedProducts: purchaseResult.failedProducts };
      }
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      return { success: false, error: 'Internal Server Error' };
    }
  }

};


export default cartService;
