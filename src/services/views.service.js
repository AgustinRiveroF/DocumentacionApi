import { logger } from "../utils/logger.js";


const viewsService = {
    renderLogin: (req, res) => {
      if (req.session.user) {
        console.log('Redirigiendo desde service');
        return res.redirect('/api/products');
      }
      res.render('login');
    },
  
    renderSignup: (req, res) => {
      res.render('signup');
    },
  
    renderProfile: (req, res) => {
      if (!req.session.passport) {
        return res.redirect('views/login');
      }
      res.render('profile', { user: req.user });
    },

    loggerTest: (req, res) =>{
      logger.info('Información de prueba');
      logger.warning('Advertencia de prueba');
      logger.error('Error de prueba');
      logger.fatal('Fatal de prueba');
      logger.http('Http de prueba');
      logger.debug('Debug de prueba');
      
      res.send('Logs generados en la consola, verificar la salida');
    }
  };
  
  export default viewsService;
  