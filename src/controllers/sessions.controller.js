// sessions.controller.js
import passport from 'passport';
import sessionService from '../services/session.service.js';
import { usersManager } from '../daos/managers/users.dao.js';

const sessionsController = {
  getUser: (req, res) => {
    const user = req.session.passport ? req.session.passport.user : null;

    if (user && user.email) {
      res.json({ email: user.email, role: user.role });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  },

  signup: passport.authenticate('signup', {
    successRedirect: '/views/login',
    failureRedirect: '/views/signup',
    
  }),

  login: async (req, res) => {
    let errorMessage = '';

    try {
      const { email, password } = req.body;

      const adminUser = sessionService.loginAdmin(email, password);
      if (adminUser) {
        req.session.user = adminUser;
        return res.render('admin');
      }

      const user = await sessionService.loginUser(email, password);

      if (!user) {
        return res.redirect('/views/signup');
      }

      req.session.user = user;
      console.log('Redirigiendo desde sessions controller');
      res.redirect('/api/products');
    } catch (error) {
      console.error('Error en la ruta de login:', error);
      return res.status(500).json({ error });
    }
  },

  githubAuth: passport.authenticate('github', { scope: ['user:email'] }),


  githubCallback: passport.authenticate('github', {
    failureRedirect: '/views/login',
    successRedirect: '/api/products',
  }),


  getCurrentUser: (req, res) => {
    res.json({ user: req.user });
  },
};

export default sessionsController;
