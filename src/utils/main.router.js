import express from 'express';
import productsRouter from '../routes/products.router.js';
import carritosRouter from '../routes/carts.router.js';
import viewsRouter from '../routes/views.router.js';
import sessionRouter from '../routes/sessions.router.js';
import chatRouter from '../routes/chat.router.js';
import cookieRouter from '../routes/cookie.router.js';
import logoutRouter from '../routes/logout.router.js';
import adminRouter from '../routes/admin.router.js';
import usersRouter from '../routes/users.router.js';
import swaggerUi from 'swagger-ui-express';
import { swaaggerSetup } from './swagger.js';


const mainRouter = express.Router();

mainRouter.use("/api/users", usersRouter);          // Usuarios, roles, documentacion;
mainRouter.use("/api/products", productsRouter);    // Productos;
mainRouter.use('/api/carts', carritosRouter);       // Obtener eliminar y actualizar carrito's;
mainRouter.use("/api/sessions", sessionRouter);     // Login, signup, github, callback y current;   

mainRouter.use("/admin", adminRouter);              // AdminController, Enviar correo con el producto eliminado;
mainRouter.use("/views", viewsRouter);              // Login, signup, recoverPassword, documents;
mainRouter.use("/chat", chatRouter);                // Chat en tiempo real;
mainRouter.use("/cookie", cookieRouter);            // Obtener cookies;
mainRouter.use("/logout", logoutRouter);            // Destruir session

// Swagger                                          //Documentacion swagger
mainRouter.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaaggerSetup)); 

export default mainRouter;