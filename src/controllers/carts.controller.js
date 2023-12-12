import cartService from "../services/cart.service.js";

const cartController = {
  getPopulatedCart: async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartService.findCartById(cid);
      // Puedes realizar operaciones adicionales o retornar la respuesta directamente
      res.status(200).json({ cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  getCartById: async (req, res) => {
    try {
      const { idCart } = req.params;
      const cart = await cartService.findCartById(idCart);
      res.status(200).json({ cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
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
      const cart = await cartService.createCart();
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
      const { cid } = req.params;
      const { productId, quantity } = req.body;
      const cart = await cartService.addProductToCartWithId(cid, productId, quantity);
      res.status(200).json({ cart });
    } catch (error) {
      console.error(error);
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
};

export default cartController;

