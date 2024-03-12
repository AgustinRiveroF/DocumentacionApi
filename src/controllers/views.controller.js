import { usersManager } from '../dao/managers/users.dao.js';
import ticketService from '../services/ticket.service.js';
import viewsService from '../services/views.service.js';
import { hashData, generateUniqueToken, compareData } from "../utils/utils.js";
import { transporter } from "../utils/nodemailer.js";
import { logger } from '../utils/logger.js';




const viewsController = {
  renderLogin: (req, res) => {
    if (req.session.user) {
      return res.redirect('/api/products');
    }
    res.render('login');
  },

  renderSignup: (req, res) => {
    res.render('signup');
  },

  renderProfile: (req, res) => {
    if (!req.session.passport) {
      return res.redirect('/views/login');
    }
    res.render('profile', { user: req.user });
  },

  loggerTest: (req, res) => {
    viewsService.loggerTest(req, res);
  },

  forgottenPassword: async (req, res) => {
    const { email } = req.body
    const resetLink = `http://localhost:8080/views/recoverPasswordWithEmail`;

    res.render('forgottenPassword');

    if (!email) {
      return null;
    }

    const mailOptions = {
      from: 'FastDelivery',
      to: email,
      subject: `Restaurar contraseña`,
      html: `Haz clic <a href="${resetLink}">aquí</a> para restaurar tu contraseña`,
    };
    await transporter.sendMail(mailOptions);

  },

  recoverPassword: async (req, res) => {
    const { email } = req.body
    const expirationTime = Date.now() + 60 * 60 * 1000;
    const codigo = generateUniqueToken()

    req.session.expirationTime = expirationTime;

    const resetLink = `http://localhost:8080/views/recoverPasswordWithEmail?email=${email}&codigo=${codigo}`;

    const mailOptions = {
      from: 'FastDelivery',
      to: email,
      subject: `Restaurar contraseña`,
      html: `Haz clic <a href="${resetLink}">aquí</a> para restaurar tu contraseña, tu codigo es ${codigo}`,
    };
    await transporter.sendMail(mailOptions);

    const codeGenerado = codigo;

    req.session.codeGenerado = codeGenerado;

    res.render('recover')
  },

  recoverPasswordWithEmail: async (req, res) => {

    const { email, newPassword, codeGenerado } = req.body

    logger.info(`Este es el email: ${email} Y esta es la nueva contraseña ${newPassword} Y este es el codigo ${codeGenerado}`)

    res.render('recoverPassword');

  },

  ahorasi: async (req, res) => {
    try {
      const { email, newPassword, codeIngresado } = req.body;
      const expirationTime = req.session.expirationTime;
      const codeGenerado = req.session.codeGenerado;

      if (Date.now() > parseInt(expirationTime, 10)) {
        return res.send('El link expiró');
      }

      if (codeIngresado !== codeGenerado) {
        return res.send('Código incorrecto');
      }

      const user = await usersManager.findByEmail(email);
      if (!user) {
        return res.send('Usuario no encontrado');
      }

      const isSamePassword = await compareData(newPassword, user.password);

      if (isSamePassword) {
        return res.send('No puedes usar la misma contraseña');
      }

      const resetResult = await usersManager.resetPassword(email, newPassword);

      if (resetResult.success) {
        return res.render('login');
      } else {
        return res.send('Error al restablecer la contraseña');
      }
    } catch (error) {
      console.error('Error al recuperar la contraseña:', error);
      res.status(500).send('Error al recuperar la contraseña');
    }
  },

  documents: (req, res) => {
    res.render('documents')
  },

  adminProducts: (req, res) => {
    res.render('adminProducts')
  },

  usersActivity: (req, res) => {
    res.render('adminActivity')
  },

  changeRoles: (req, res) => {
    res.render('adminRoles')
  },

  orders: async (req, res) => {
    try {
      const tickets = await ticketService.getTickets();

      if (!tickets || tickets.length === 0) {
        return res.render('adminOrders');
      }

      const ticketData = {
        tickets: await Promise.all(tickets.map(async ticket => {
          const buynerTicket = await usersManager.findById(ticket.userId);
          return {
            _id: ticket._id,
            code: ticket.code,
            purchase_datetime: ticket.purchase_datetime.toLocaleString(),
            amount: ticket.amount,
            purchaser: ticket.purchaser,
            userId: ticket.userId,
            buynerTicket: buynerTicket.email,
            products: ticket.products.map(product => ({
              product_name: product.product_name,
              product_description: product.product_description,
              product_price: product.product_price
            }))
          };
        })),
      };

      res.render('adminOrders', { ticketData, tickets });
    } catch (error) {
      console.error('Error al obtener el ticket:', error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  },

  deleteOrders: async (req, res) => {
    try {
      const { ti } = req.params;
      const ticketId = ti;

      if (!ticketId) {
        return res.status(404).json({ status: 'error', message: 'tickets not found' });
      }

      const response = await ticketService.deleteTicket(ticketId);

      res.redirect('/views/admin/orders');
    } catch (error) {
      console.error('Error al eliminar el ticket:', error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }


};

export default viewsController;
