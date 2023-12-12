import { cartsManager } from "../daos/managers/carts.dao.js";

const cartService = {
  findCartById: async (cid) => {
    const cart = await cartsManager.findCartById(cid);
    return cart;
  },

  getAllCarts: async () => {
    const carts = await cartsManager.getAllCarts();
    return carts;
  },

  createCart: async () => {
    const cart = await cartsManager.createCart();
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
};

export default cartService;
