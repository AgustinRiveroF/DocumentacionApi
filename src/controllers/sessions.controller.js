import { Router } from 'express';
import passport from 'passport';
import sessionService from '../services/session.service.js';
import { usersManager } from '../dao/managers/users.dao.js';
import { transporter } from '../utils/nodemailer.js';
import { cartsModel } from '../dao/models/cart.models.js';
import currentDTO from '../dao/dto/current.dto.js';
import usersRepository from '../dao/repositories/users.repository.js';
import { client } from '../utils/twilio.js';
import config from '../dao/config/config.js';
import { logger } from '../utils/logger.js';

const router = Router();

function generarNumerosAleatorios() {
  const numerosAleatorios = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
  return numerosAleatorios.join('');
}

const resultados = generarNumerosAleatorios();

const sessionsController = {
  getUser: (req, res) => {
    const user = req.session.passport ? req.session.passport.user : null;
    if (user && user.email) {
      res.json({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name, 
        email: user.email,
        role: user.role,
        cartId: user.cartID, 
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  },
    
  signup: async (req, res) => {
    passport.authenticate('signup', async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const createdCart = await cartsModel.create({ userId: user._id, products: [] });
      user.cartId = createdCart._id;
      await user.save();

      req.login(user, async (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ error: loginErr.message });
        }

        const { first_name, last_name, email } = req.body;
        
        // NODEMAILER

        const mailOptions = {
          from: 'Hamburgueseria',
          to: email,
          subject: `Bienvenido ${first_name} ${last_name}`,
          html: `<h1>Bienvenido a <b>Hamburgueseria</b></h1><h2>Tu aventura esta recien comenzando!</h2><h3>Ante todo, gracias por unirte a nosotros</h3><p>Vamos a estar facilitando la manera en la que haces tus compras. Te invitamos a seguir explorando nuestra app para disfrutar todas nuestras ofertas</p>`,
        };
        await transporter.sendMail(mailOptions);

        // TWILIO

        const twilioOptions = {
          body: `TU CODIGO ES ${resultados}`,
          to: 'whatsapp:+5493512877467',
          from: config.twilio_whatsapp_number,
        };
        await client.messages.create(twilioOptions);


        return res.redirect('/views/login');
      });
    })(req, res);
  },

  login: async (req, res) => {
    console.log("Estoy en sessions login");
    let errorMessage = '';
    try {
      console.log("paso 1");
      const adminUser = sessionService.loginAdmin(email, password);
      if (adminUser) {
        req.session.passport.user = adminUser;
        res.render('admin');
      }
      console.log("paso 2");
      const user = await sessionService.loginUser(email, password);

      if (!user) {
        return res.redirect('/views/signup');
      }
      console.log("paso 3");
      
      req.session.passport.user = user;
      logger.info('Redirigiendo desde sessions controller');
      console.log("paso 4");
      res.redirect('/api/products');
    } catch (error) {
      console.error('Error en la ruta de login:', error);
      return res.status(500).json({ error });
    }
  },
  //g
  githubAuth: passport.authenticate('github', { scope: ['user:email'] }),


  githubCallback: passport.authenticate('github', {
    failureRedirect: '/views/login',
    successRedirect: '/api/products',
  }),

  getCurrentUser: (req, res) => {
    const user = req.session.passport.user;

    if (user) {
      const userDTO = new currentDTO(user);
      return res.json(userDTO);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  },

};

export default sessionsController;
