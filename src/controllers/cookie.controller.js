// cookie.controller.js
import cookieService from '../services/cookie.service.js';
import { logger } from '../utils/logger.js';

const cookieController = {
  setSession: (req, res) => {
    const { name, email } = req.body;
    cookieService.setSessionData(req, name, email);
    res.send('Session set successfully');
  },

  viewCookie: (req, res) => {
    logger.info(req.session);
    res.send('View cookie');
  },
};

export default cookieController;
