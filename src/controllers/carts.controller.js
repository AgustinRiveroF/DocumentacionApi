import cartService from "../services/cart.service.js";
import { productModel } from "../dao/models/product.model.js";
import { cartsModel } from "../dao/models/cart.models.js";
import ticketService from "../services/ticket.service.js";
import { usersManager } from "../dao/managers/users.dao.js";
import Ticket from "../dao/models/ticket.model.js";
import passport from "passport";
import '../passport.js'
import { sessionInfo } from "../middlewares/session.middleware.js";


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
      console.log(userId);
      const cart = await cartsModel.findOne({ userId })  //.populate('products.productId');

      console.log('Contenido del carrito:', cart);


      if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Cart not found' });
      }
      

      res.json({ cart });
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
    try {
      const { cartId } = req.params;
      const { productId, quantity } = req.body;

      console.log("cartId:", cartId);
      console.log("productId:", productId);
      console.log("quantity:", quantity);

      if (!cartId) {
        return res.status(400).json({ status: 'error', message: 'Cart ID is required in controllers' });
      }

      if (!productId) {
        return res.status(400).json({ status: 'error', message: 'The product ID is required' });
      }

      const cart = await cartService.addProductToCartWithId(cartId, productId, quantity);
      console.log("Contiene");
      res.status(200).json({ cart });
    } catch (error) {
      console.error("The error is",error);
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
      res.status(200).json({ message: "Product removed from cart" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },


  finalizePurchase: async (req, res) => {

    sessionInfo(req, res, async () => {
      try {
        const cartId = req.params.cid;

        const purchaseResult = await cartService.finalizePurchase(cartId);

        if (purchaseResult.success) {
          const purchaser = generateUniqueCode();

          const userId = res.locals.userId;

          const ticketData = {
            code: generateUniqueCode(),
            purchase_datetime: new Date(),
            amount: purchaseResult.totalAmount,
            purchaser,
            userId,
          };

          const ticket = await ticketService.createTicket(ticketData);
          res.json({ success: true, ticket });
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

