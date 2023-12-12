// logout.controller.js
import logoutService from '../services/logout.service.js';

const logoutController = {
  logoutUser: async (req, res) => {
    try {
      await logoutService.destroySession(req);
      res.redirect('/views/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      res.status(500).json({ status: 'error', message: 'Error al cerrar sesión' });
    }
  },
};

export default logoutController;
