import { logger } from "../../utils/logger.js";
import { cartsModel } from "../models/cart.models.js";
import { usersModel } from "../models/users.model.js";
import mongoose from "mongoose";


class CartsManager {
  async createCart(userId) {
    const newCart = { userId, products: [] };
    const response = await cartsModel.create(newCart);
    return response;
  }
  

  async findCartById(idCart) {
    try {
      const response = await cartsModel.findById(idCart).populate('products.product');
      return response;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCartWithId(cartId, productId, quantity) {
    try {
      const cart = await cartsModel.findOne({ _id: cartId });

      if (!cart) {
        throw new Error(`Cart with id ${cartId} not found`);
      }

      const productIndex = cart.products.findIndex(
        (p) => p.product && p.product.equals(productId)
      );

      if (productIndex === -1) {
        if (!cart.products) {
          cart.products = [];
        }
        if (!productId) {
          throw new Error("ProductId is required");
        }
        cart.products.push({ productId, quantity: quantity });
      } else {
        cart.products[productIndex].quantity += quantity;
      }

      await cart.save();
      return cart;
    } catch (error) {
      logger.info("No se puedo agregar");
      throw error;
    }
  }

  async addProductToCart(idCart, idProduct) {
    const cart = await cartsModel.findById(idCart);

    const productIndex = cart.products.findIndex(
      (p) => p.product.equals(idProduct)
    );

    if (productIndex === -1) {
      cart.products.push({ product: idProduct, quantity: 1 });
    } else {
      cart.products[productIndex].quantity++;
    }
    return cart.save();
  }


  async getAllCarts() {
    try {
      const carts = await cartsModel.find();
      return carts;
    } catch (error) {
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await cartsModel.findById(cartId);

      if (!cart) {
        throw new Error("Remove product to cart not found");
      }

      const productIndex = cart.products.findIndex(product => product.product && product.product.toString() === productId);

      if (productIndex === -1) {
        throw new Error("Product not found in cart");
      }

      cart.products.splice(productIndex, 1);

      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cartId, products) {
    logger.info('updateCart function called');
    try {
      const productsArray = Array.isArray(products) ? products : [products];
  
      const cart = await cartsModel.findById(cartId);
  
      if (!cart) {
        throw new Error(`Cart with id ${cartId} not found`);
      }

      const isProductIdValid = productsArray.every(product => {
        const isValid = product._id !== undefined && product._id !== null;

        logger.info(`isValid: ${isValid}`);
        logger.info(`product: ${product}`);

        if (!isValid) {
          console.error(`Invalid productId for product: ${JSON.stringify(product)}`);
        }
        return isValid;
      });
      
      logger.info(`isProductIdValid: ${isProductIdValid}`);
      logger.info(`cart.products: ${cart.products}`);
  
      if (!isProductIdValid) {
        throw new Error("ProductId is required for all products");
      }
  
      const updatedProducts = productsArray.map(product => ({
        productId: product._id,
        quantity: product.quantity || 1,
      }));
  
      cart.products = updatedProducts;
  
      await cart.save();
  
      logger.info(`Cart after update:${cart}`);
  
      return cart;
    } catch (error) {
      throw new Error(`Error updating cart: ${error.message}`);
    }
  }
  

  async getCartById(cartId) {
    try {
      const response = await cartsModel.findById(cartId).populate('products.product');
      return response;
    } catch (error) {
      throw error;
    }
  }


  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartsModel.findById(cartId);

      if (!cart) {
        throw new Error(`Cart with id ${cartId} not found`);
      }

      const productIndex = cart.products.findIndex(product => product.product.toString() === productId);

      if (productIndex === -1) {
        throw new Error(`Product with id ${productId} not found in cart`);
      }

      cart.products[productIndex].quantity = quantity;

      await cart.save();

      return cart;
    } catch (error) {
      throw new Error(`Error updating product quantity in cart: ${error.message}`);
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await cartsModel.findById(cartId);

      if (!cart) {
        throw new Error(`Cart with id ${cartId} not found`);
      }

      cart.products = [];

      await cart.save();

      return cart;
    } catch (error) {
      throw new Error(`Error clearing cart: ${error.message}`);
    }
  }

}

export const cartsManager = new CartsManager();