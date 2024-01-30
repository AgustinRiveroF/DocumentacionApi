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

// Rutas para el back
mainRouter.use("/api/users", usersRouter);
mainRouter.use("/api/products", productsRouter);
mainRouter.use('/api/carts', carritosRouter);
mainRouter.use("/api/sessions", sessionRouter);

// Rutas para el front
mainRouter.use("/admin", adminRouter);
mainRouter.use("/views", viewsRouter);
mainRouter.use("/chat", chatRouter);
mainRouter.use("/cookie", cookieRouter);
mainRouter.use("/logout", logoutRouter);

// Swagger 
mainRouter.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaaggerSetup));

export default mainRouter;