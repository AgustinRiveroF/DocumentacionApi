import productsRepository from '../dao/repositories/products.repository.js';
import { logger } from '../utils/logger.js';
import { cartsManager } from '../dao/managers/carts.dao.js';
import { productManager } from '../dao/managers/product.dao.js';
import ticketService from '../services/ticket.service.js';
import { cartsModel } from '../dao/models/cart.models.js';


const productsController = {
  
  getProducts: async (req, res) => {
    try {
      const { limit = 12, page = 1, sort, query } = req.query || {};
      const options = { limit: parseInt(limit), page: parseInt(page), sort, query,};

      const tickets = await ticketService.getTickets();
      const totalTickets = tickets.length;

      const products = await productsRepository.getAll(options);
      const productsNotLimit = await productManager.findAllNotLimit();

      const totalProducts = products.length;
      const currentPage = parseInt(page);
      const totalPages = Math.ceil(productsNotLimit.length / parseInt(limit));
      const hasPrevPage = currentPage > 1;
      const hasNextPage = currentPage < totalPages;
      const prevPage = hasPrevPage ? currentPage - 1 : null;
      const nextPage = hasNextPage ? currentPage + 1 : null;
      const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${prevPage}&sort=${sort}` : null;
      const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${nextPage}&sort=${sort}` : null;

      const { cartID, id, first_name, last_name, email, role } = req.session.passport.user;
      const { cartIDs, ids, first_names, last_names, emails, roles } = req.query;
      const cartIdGithub = await cartsManager.findCartByUser(req.session.passport.user.id)

      const userId = id;
      const cartTotalProducts = await cartsModel.findOne({ userId });
      const totalProductsInCart = cartTotalProducts.products.length;

      if (role === 'admin' && !cartID) {
        req.session.passport.user.cartID = "65d06bf6f18bf2c9583d5477";
      }

      const cart = await cartsManager.findCartById(cartID || cartIdGithub);
      const cartProducts = cart.products;
      const cartProductId = cartProducts.productId;
      const productos = + await productManager.findOneById(cartProductId);
      const cartIdfromUser = cartID;
      const productTotals = [...products, cartIdfromUser];

      const userRole = (req.query.emails || req.session.passport.user.email) === 'adminCoder@coder.com' ? 'admin' : 'usuario';

      const mixedCartIds = cartID || cartIdGithub._id;

      const userData = { cartID: mixedCartIds, id, first_name, last_name, email, role,};
      const userDataTest = { cartIDs, ids, first_names, last_names, emails, roles,};

      if (userDataTest.cartIDs) {
        console.log('Se inicio un proceso de test, userDataTest: ', userDataTest);
      } else {
        console.log("Este es el userData:", userData);
      }
      const isTestingRequest = req.get('X-Testing-Request') === 'true';

      if (isTestingRequest) {
        const products = await productsRepository.getAll(options);
        res.json(products);
      } else {
        if (userRole === 'admin') {
          const cartID = "65d06bf6f18bf2c9583d5477";
          return res.render('admin', {
            user: userData,
            role: userRole,
            totalTickets
          });
        } else {
          res.render('products', {
            user: userData,
            role: userRole,
            products,
            cartProducts,
            productos,
            cartIdGithub,
            cartID,
            productTotals,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
            currentPage,
            totalProductsInCart,
          });
        }
      }

    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await productsRepository.getById(pid);

      if (!product) {
        return res.status(404).json({ status: 'error', message: 'Product not found' });
      }

      res.render('productDetails', { product: product.toObject() });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  createProduct: async (req, res) => {

    const { role } = req.body.role || req.session.passport.user.role || req.session.cookie || {};
    let userRole = req.body.role || req.session.passport.user.role;

    try {

      if (userRole === 'admin' || 'premium') {
        const { first_name, last_name, email, owner } = req.session.user || req.body.owner || {};
        const { product_name, product_price, product_description, stock } = req.body;

        const emailDelCreador = req.body.owner || req.session.passport.user.email;

        const createProduct = await productsRepository.create({
          product_name,
          product_price,
          stock,
          product_description,
          owner: emailDelCreador,
        });

        logger.info(`Este es el createProduct: ${createProduct}`)

      }
      return res.render('admin', { Message: 'Producto Agregado' });



    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { productId } = req.params;

      const deletedProduct = await productsRepository.deleteById(productId);

      if (!deletedProduct) {
        return res.status(404).json({ status: 'error', message: 'Product not found' });
      }

      res.status(200).json({ status: 'success', message: 'Product deleted', deletedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  },

  addToCart: async (req, res) => {
    try {
      const { pid } = req.params;
      const { user } = req.session.passport;

      const userId = user._id;
      const productId = pid;
      const quantity = 1;

      const addToCartResponse = await productsRepository.addToCart(userId, productId, quantity);

      logger.info(`Producto Agregado: ${addToCartResponse}`)

      res.redirect('/api/products');
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
};



export default productsController;
