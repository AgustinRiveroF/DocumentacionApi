import productsService from '../services/products.sevice.js';
import productsRepository from '../dao/repositories/products.repository.js';
import { usersModel } from '../dao/models/users.model.js';
import { usersManager } from '../dao/managers/users.dao.js';
import { logger } from '../utils/logger.js';
import { productModel } from '../dao/models/product.model.js';



const productsController = {
  getProducts: async (req, res) => {
    try {
      /* if (!req.session.passport || !req.session.passport.user || !req.session || !req.session.passport.user.email) {
        console.log('no hay nadie registrado');
        return res.redirect('/views/login');
      } */


      const { limit = 12, page = 1, sort, query } = req.query || {};

      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        query,
      };

      //const products = await productsService.getProducts(options);

      const products = await productsRepository.getAll(options);

      const totalProducts = products.length;
      const totalPages = totalProducts > 0 ? Math.ceil(totalProducts / limit) : 1;
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      const prevPage = hasPrevPage ? page - 1 : null;
      const nextPage = hasNextPage ? page + 1 : null;
      const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${prevPage}&sort=${sort}` : null;
      const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${nextPage}&sort=${sort}` : null;
      
      const { cartID, id, first_name, last_name, email, role } = req.session.passport.user;
      const { cartIDs, ids, first_names, last_names, emails, roles } = req.query;


      const userRole = (req.query.emails || req.session.passport.user.email) === 'adminCoder@coder.com' ? 'admin' : 'usuario';
      

      console.log("HOLA DE NUEVOOOOOOOOOOOOOOOO", userRole);


      const userData = {
        cartID,
        id,
        first_name,
        last_name,
        email,
        role,
      };
      const userDataTest = {
        cartIDs,
        ids,
        first_names,
        last_names,
        emails,
        roles,
      };

      console.log("Este es el userDataTest", userDataTest);

      console.log("Este es el userData:");
      //logger.info("Este es el userData:", userData);
      
      const isTestingRequest = req.get('X-Testing-Request') === 'true';

      if (isTestingRequest) {

        const products = await productsRepository.getAll(options);
        res.json(products);
    } else {
      if (userRole === 'admin') {
        return res.render('admin', {
          user: userData,
          role: userRole,
        });
      } else {
        res.render('products', {
          user: userData,
          role: userRole,
          products,
          totalPages,
          prevPage,
          nextPage,
          page,
          hasPrevPage,
          hasNextPage,
          prevLink,
          nextLink,
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

      //const products = await productsService.getProductById(pid);
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
      
      if (userRole === 'admin' || 'premium' ) {
        const { first_name, last_name, email, owner } = req.session.user|| req.body.owner|| {};
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
      logger.info('Contenido de req.session.passport:', req.session.passport);

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
