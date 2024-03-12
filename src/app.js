import express from 'express';
import mainRouter from './utils/main.router.js';
import config from "./dao/config/config.js"
import { engine } from "express-handlebars";
import handlebars from 'express-handlebars';
import { Server } from "socket.io";
import { __dirname } from "./utils/utils.js";
import { messageModel } from './dao/models/message.models.js';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import fileStore from 'session-file-store';
import MongoStore from 'connect-mongo';
import './passport.js'
import passport from 'passport';
import dotenv from 'dotenv'
import { logger } from './utils/logger.js';


// Clusterizacion
import { cpus } from 'os';
import cluster from 'cluster';
import { extractFormData } from './middlewares/extractData.middleware.js';

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


// Ruta Login
app.post("/api/sessions/login", passport.authenticate('login', {
  successRedirect: '/api/products',
  failureRedirect: '/views/signup',
}));

// Cluster

/* if (cluster.isPrimary) {
  logger.info(`Proceso principal: ${process.pid}`);
  for (let i = 0; i < 12; i++){
    cluster.fork();
  }
}else {
 
} */

// const numerodeprocesadores = cpus().length;
// console.log(numerodeprocesadores);


// Todas las rutas
app.use(mainRouter);


// Puerto

const PORT = config.port;


const httpServer = app.listen('https://entrega-final-production-8405.up.railway.app', () => {
  console.log(`Conectado al puerto ${PORT}, Processo worker: ${process.pid}`);
});

const socketServer = new Server(httpServer);
const messages = [];

socketServer.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

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

  socket.on("totalProductsUpdated", (totalProducts) => {
    socketServer.emit("totalProductsUpdated", totalProducts);
  });
  
});

export default app;