import { logger } from "../utils/logger.js";
import { transporter } from "../utils/nodemailer.js";
import { usersManager } from "../dao/managers/users.dao.js";
import { hashData, generateUniqueToken, compareData } from "../utils/utils.js";
import { usersModel } from "../dao/models/users.model.js";



const viewsService = {

  loggerTest: (req, res) => {
    logger.fatal('Fatal de prueba');
    logger.error('Error de prueba');
    logger.warning('Advertencia de prueba');
    logger.info('Información de prueba');
    logger.http('Http de prueba');
    logger.debug('Debug de prueba');

    res.send('Logs generados en la consola, verificar la salida');
  },

};

export default viewsService;
