import express from 'express';
import bodyParser from 'body-parser';
import { logger } from '../utils/logger.js';



// Middleware de admin

export const isAdmin = (req, res, next) => {
  logger.info(req.session.passport.user.role);
  if (req.session.passport.user.role === 'admin') {
    return next(); 
  } else {
    return res.status(403).json({ message: 'Acceso no autorizado' });
  }
};

export default isAdmin;
