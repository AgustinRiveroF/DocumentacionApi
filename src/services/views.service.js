import { logger } from "../utils/logger.js";
import { transporter } from "../utils/nodemailer.js";
import { usersManager } from "../dao/managers/users.dao.js";
import { hashData, generateUniqueToken } from "../utils/utils.js";
import { usersModel } from "../dao/models/users.model.js";



const viewsService = {
  renderLogin: (req, res) => {
    if (req.session.user) {
      logger.info('Redirigiendo desde service');
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
    logger.fatal('Fatal de prueba');
    logger.error('Error de prueba');
    logger.warning('Advertencia de prueba');
    logger.info('Información de prueba');
    logger.http('Http de prueba');
    logger.debug('Debug de prueba');

    res.send('Logs generados en la consola, verificar la salida');
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
    logger.info(codeGenerado);

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

      if (Date.now() > parseInt(expirationTime, 10)) {
          return res.send('El link expiró');
      }

      const codeGenerado = req.session.codeGenerado;

      if (codeIngresado === codeGenerado) {

        if (email && newPassword && codeIngresado) {

          logger.info('Se proporciono un correo, una contraseña y un codigo')
          logger.info(`El codigo generado: ${codeGenerado} y el codigo ingresado ${codeIngresado}`)
          const resetResult = await usersManager.resetPassword(email, newPassword);

          if (resetResult.success) {
            logger.info('Restablecimiento exitoso, redirigiendo a login')
            return res.render('login');
          } else {
            return res.send('Error al restablecer la contraseña');
          }
        }
      }
      res.render('signup');
    } catch (error) {
      console.error('Error al recuperar la contraseña:', error);
      res.status(500).send('Error al recuperar la contraseña');
    }

  },

};

export default viewsService;
