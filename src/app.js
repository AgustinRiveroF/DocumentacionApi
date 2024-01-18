import express from 'express';
import productsRouter from './routes/products.router.js'
import config from "./dao/config/config.js"
import { engine } from "express-handlebars";
import handlebars from 'express-handlebars';
import { Server } from "socket.io";
import { __dirname } from "./utils/utils.js";
import carritosRouter from './routes/carts.router.js';
import { messageModel } from './dao/models/message.models.js';
import viewsRouter from "./routes/views.router.js"
import bodyParser from 'body-parser';
import sessionRouter from './routes/sessions.router.js'
import chatRouter from './routes/chat.router.js'
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cookieRouter from './routes/cookie.router.js'
import fileStore from 'session-file-store';
import MongoStore from 'connect-mongo';
import logoutRouter from './routes/logout.router.js';
import adminRouter from './routes/admin.router.js'
import './passport.js'
import passport from 'passport';
import dotenv from 'dotenv'
import { logger } from './utils/logger.js';

dotenv.config();

const FileStore = fileStore(session);
const app = express();



const hbs = handlebars.create({
  helpers: {
    if_eq: function (a, b, opts) {
      if (a == b) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("SecretCookie"))

// Session Mongo

const URI = config.mongo_uri;

app.use(
  session({
    store: new MongoStore({
      mongoUrl: URI,
    }),
    secret: "secretSession",
    cookie: { maxAge: 1800000 },
    resave: false,
    saveUninitialized: false,
  })
);


// Passport

app.use(passport.initialize());
app.use(passport.session());


// Handlebars
app.engine(
  "handlebars",
  engine({
    defaultLayout: 'main',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    }
  })
);

app.engine("handlebars", engine({ allowProtoMethodsByDefault: true }));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.engine("handlebars", engine());

// 


// Ruta Login
app.post("/api/sessions/login", passport.authenticate('login', {
  successRedirect: '/api/products',
  failureRedirect: '/views/signup',
}));


// Rutas para el back
  
// Ruta productos
app.use("/api/products",productsRouter);

// Ruta para carritos
app.use('/api/carts',carritosRouter);

// Ruta Login
app.use("/api/sessions", sessionRouter);

// Rutas para el front

//Ruta admin
app.use("/admin", adminRouter);

// Ruta chat
app.use("/chat", chatRouter);

// Ruta views
app.use("/views", viewsRouter);

// Ruta cookies
app.use("/cookie", cookieRouter);

// Ruta 
app.use("/logout", logoutRouter);


// Puerto

const PORT = config.port;


const httpServer = app.listen(PORT, () => {
  logger.info(`Conectado al puerto ${PORT}`);
});

const socketServer = new Server(httpServer);
const messages = [];

socketServer.on("connection", (socket) => {
  logger.info(`Cliente conectado: ${socket.id}`);

  socket.on("newUser", (user) => {
    socket.broadcast.emit("userConnected", user);
    socket.emit("connected");
  });

  socket.on("message", async (infoMessage) => {
    try {
      const message = new messageModel({
        user_email: infoMessage.name,
        user_message: infoMessage.message,
      });
      await message.save();
    } catch (error) {
      console.error("Error al guardar el mensaje en la base de datos:", error);
    }

    messages.push(infoMessage);
    socketServer.emit("chat", messages);
  });
});