import express from 'express';
import bodyParser from 'body-parser';


// Middleware de admin

export const isAdmin = (req, res, next) => {
  console.log(req.session.passport.user.role);
  if (req.session.passport.user.role === 'admin') {
    return next(); 
  } else {
    return res.status(403).json({ message: 'Acceso no autorizado' });
  }
};

export default isAdmin;
