import winston from "winston";
import config from "../dao/config/config.js";

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'green',
        http: 'black',
        debug: 'white',
    },
};

let transports = [];

// Transporte de consola para desarrollo, nivel debug
if (config.enviroment === 'development') {
    transports.push(new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
            winston.format.colorize({ colors: customLevels.colors }),
            winston.format.simple(),
        )
    }));
}

// Transporte de archivo para produccion, nivel error
if (config.enviroment === 'production') {
    transports.push(new winston.transports.File({
        level: 'error',
        filename: 'errors.log',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.prettyPrint(),
        )
    }));
}

// Cambiar de entorno en Enviroment (.env)

export const logger = winston.createLogger({
    levels: customLevels.levels,
    transports: transports,
});
