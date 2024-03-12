import cartService from "../services/cart.service.js";
import { productModel } from "../dao/models/product.model.js";
import { cartsModel } from "../dao/models/cart.models.js";
import ticketService from "../services/ticket.service.js";
import { usersManager } from "../dao/managers/users.dao.js";
import Ticket from "../dao/models/ticket.model.js";
import passport from "passport";
import '../passport.js'
import { sessionInfo } from "../middlewares/session.middleware.js";
import { logger } from "../utils/logger.js";
import { cartsManager } from "../dao/managers/carts.dao.js";


function generateUniqueCode() {
  return Math.floor(Math.random() * 10000000).toString();
}


const cartController = {
  getPopulatedCart: async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartService.findCartById(cid);
      res.status(200).json({ cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  getCartById: async (req, res) => {
    const userId = req.params.id;
    try {
      const cart = await productModel.findOne({ user: userId }).exec();
      res.json(cart);
    } catch (error) {
      console.error("Error al obtener el carrito por ID:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  getMyCart: async (req, res) => {
    try {
      const userId = req.session.passport.user.id;
      const cart = await cartsModel.findOne({ userId }).populate('products.productId').lean();

      if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Cart not found' });
      }

      const products = cart.products.map(product => {
        if (product.productId) {
          return {
            cartId: cart._id,
            productId: product.productId._id,
            productName: product.productId.product_name,
            productDescription: product.productId.product_description,
            productPrice: product.productId.product_price,
            quantity: product.quantity
          };
        } else {
          return {
            cartId: cart._id,
            productId: null,
            productName: 'Product not available',
            productDescription: 'Product not available',
            productPrice: 0,
            quantity: product.quantity
          };
        }
      });

      let totalAmountInCart = products.reduce((total, product) => total + product.productPrice, 0);

      const cartFinished = {
        cartId: cart._id,
        products
      };

      res.render('cartsPopulated', { cartFinished, totalAmountInCart });
    } catch (error) {
      console.error('Error getting cart:', error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  },

  getAllCarts: async (req, res) => {
    try {
      const carts = await cartService.getAllCarts();
      res.status(200).json({ carts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  createCart: async (req, res) => {
    try {
      const userId = req.session.passport.user.id;

      const cart = await cartService.createCart(userId);

      res.status(201).json({ cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  addProductToCart: async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const cart = await cartService.addProductToCart(cid, pid);
      res.status(200).json({ cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  addProductToCartWithId: async (req, res) => {
    console.log("Esto es el req.body: ", req.body);
    try {
      const { cartId } = req.params;
      const { productId, quantity, product_name, product_price, product_description } = req.body;


      logger.info(`Producto agregado: cartId: ${cartId}, productId: ${productId}, product_name: ${product_name}, product_price: ${product_price} ,quantity: ${quantity}`);

      if (!cartId) {
        return res.status(400).json({ status: 'error', message: 'Cart ID is required in controllers' });
      }

      if (!productId) {
        return res.status(400).json({ status: 'error', message: 'The product ID is required' });
      }

      const cart = await cartService.addProductToCartWithId(cartId, productId, quantity, product_name, product_description, product_price);
      res.status(200).json({ cart });
    } catch (error) {
      console.error("The error is", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  updateCart: async (req, res) => {
    try {
      const { cid } = req.params;
      const updatedCart = req.body;
      const result = await cartService.updateCart(cid, updatedCart);
      res.status(200).json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  updateProductQuantity: async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      await cartService.updateProductQuantity(cid, pid, quantity);
      res.status(200).json({ message: "Product quantity updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  clearCart: async (req, res) => {
    try {
      const { cid } = req.params;
      await cartService.clearCart(cid);
      res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  removeProductFromCart: async (req, res) => {
    try {
      const { cid, pid } = req.params;
      await cartService.removeProductFromCart(cid, pid);
      res.redirect('/api/carts/my-cart')
      //res.status(200).json({ message: "Product removed from cart" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },


  finalizePurchase: async (req, res) => {

    sessionInfo(req, res, async () => {
      const { id } = req.session.passport.user;
      const userId = id;
      try {
        const cartId = req.params.cid;
        const cart = await cartsManager.findCartById(cartId);
        const purchaseResult = await cartService.finalizePurchase(cartId);

        const productsInCart = cart.products.product_name;

        console.log("Esto es productsInCart: ", productsInCart);

        if (purchaseResult.success) {
          const purchaser = generateUniqueCode();

          const userId = req.session.passport.user.id;

          const ticketData = {
            code: generateUniqueCode(),
            purchase_datetime: new Date(),
            amount: purchaseResult.totalAmount,
            purchaser,
            userId,
            products: [],
          };

          for (const product of cart.products) {
            const productInfo = await productModel.findById(product.productId).exec();

            ticketData.products.push({
              productId: product.productId,
              quantity: product.quantity,
              product_name: productInfo.product_name,
              product_description: productInfo.product_description,
              product_price: productInfo.product_price
            });

          }

          const ticket = await ticketService.createTicket(userId, ticketData);
          const fetchedTicket = await ticketService.getTicketById(ticket._id);

          res.render('ticket', { success: true, ticket, purchaseResult, cartId, ticketData, fetchedTicket });
        } else {
          res.json({ success: false, failedProducts: purchaseResult.failedProducts });
        }
      } catch (error) {
        console.error('Error en la compra:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
    });
  },

};


export default cartController;

