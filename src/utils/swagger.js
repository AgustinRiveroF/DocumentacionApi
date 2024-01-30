import swaggerJSDoc from "swagger-jsdoc";
import { __dirname } from "./utils.js";

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
          title: 'Ecommerce',
          version: '1.0.0',
          description: 'API documentation for ecommerce products',
        },
      },
      apis: [`${__dirname}/docs/*.yaml`],
};



export const swaaggerSetup = swaggerJSDoc(swaggerOptions);