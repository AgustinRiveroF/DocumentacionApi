// cookie.controller.js
import cookieService from '../services/cookie.service.js';

const cookieController = {
  setSession: (req, res) => {
    const { name, email } = req.body;
    cookieService.setSessionData(req, name, email);
    res.send('Session set successfully');
  },

  viewCookie: (req, res) => {
    console.log(req.session);
    res.send('View cookie');
  },
};

export default cookieController;
