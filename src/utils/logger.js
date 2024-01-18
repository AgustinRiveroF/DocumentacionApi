import winston from "winston";
import config from "../dao/config/config.js";

/* export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level:'silly',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({
            level:'warn',
            filename:'logs-files.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.prettyPrint()
            ),
        }),
    ],
}) */

const customLevels = {
    levels: {
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5,
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

/* export const logger = winston.createLogger({
    levels: customLevels.levels,
    transports:[
        new winston.transports.Console({
            level:'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevels.colors }),
                winston.format.simple(),
            )
        }),
        new winston.transports.File({
            level: 'warning',
            filename: 'logs-file.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.prettyPrint()
            ),
        }),
    ],
}); */

export let logger;

if (config.enviroment === 'production') {
    logger = winston.createLogger({
        levels: customLevels.levels,
        transports:[
            new winston.transports.File({
                level:'error',
                filename:'errors.log',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.prettyPrint(),
                )
            }),
        ],
    });
} else {
    logger = winston.createLogger({
        transports:[
            new winston.transports.Console({
                level:'info',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevels.colors }),
                    winston.format.simple(),
                )
            }),
        ],
    });
}

if (config.enviroment === 'development') {
    logger = winston.createLogger({
        levels: customLevels.levels,
        transports:[
            new winston.transports.Console({
                level:'info',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevels.colors }),
                    winston.format.simple(),
                )
            }),
        ],
    });
} else {
    logger = winston.createLogger({
        transports:[
            new winston.transports.Console({
                level:'debug',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevels.colors }),
                    winston.format.simple(),
                )
            }),
        ],
    });
}