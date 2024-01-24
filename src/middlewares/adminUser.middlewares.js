import express from 'express';
import bodyParser from 'body-parser';
import { logger } from '../utils/logger.js';
import { usersModel } from '../dao/models/users.model.js';
import { productModel } from '../dao/models/product.model.js';


// Middleware de admin

export const isAdmin = (req, res, next) => {
  logger.info(req.session.passport.user.role);
  if (req.session.passport.user.role === 'admin') {
    return next(); 
  } else {
    return res.status(403).json({ message: 'Acceso no autorizado' });
  }
};

// Middleware de premium

export const isPremium = (req, res, next) => {
  logger.info(req.session.passport.user.role);
  if (req.session.passport.user.role === 'premium') {
    return next(); 
  } else {
    return res.status(403).json({ message: 'Acceso no autorizado' });
  }
};

// Middleware de premium y admin

export const isAuthorize = (req, res, next) => {
  logger.info(req.session.passport.user.role);

  const userRole = req.session.passport.user.role; 

  if (userRole === 'premium' || userRole === 'admin') {
    return next(); 
  } else {
    return res.status(403).json({ message: 'Acceso no autorizado' });
  }
};

// Middldeware de modificar un producto

export const modifyProduct = async (req, res, next) => {
  const userEmailInSession = req.session.passport.user.email;
  const userRoleInSession = req.session.passport.user.role;

  try {
    const productId = req.body.productIdHidden || req.body.productId;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const productOwnerEmail = product.owner;

    if (userEmailInSession === productOwnerEmail || userRoleInSession === 'admin') {
      return next();
    } else {
      return res.status(403).json({ message: 'No puedes modificar un producto que no es tuyo' });
    }
  } catch (error) {
    console.error("Error al verificar el propietario del producto:", error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}


export const addToCart = async (req, res, next) => {
  const userEmailInSession = req.session.passport.user.email;
  const userRoleInSession = req.session.passport.user.role;

  try {
    const productId = req.body.productId;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const productOwnerEmail = product.owner;

    if (userRoleInSession === 'premium' && userEmailInSession === productOwnerEmail) {
      logger.info('No puedes agregar un producto que te pertenece')
      return res.status(403).json({ message: 'No puedes agregar a tu carrito un producto que te pertenece' });
    }

    return next();
  } catch (error) {
    console.error("Error al verificar el propietario del producto:", error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};



export default isAdmin;
