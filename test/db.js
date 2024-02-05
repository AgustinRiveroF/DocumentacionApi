import config from "../src/dao/config/config.js";
import mongoose from "mongoose";



mongoose
  .connect(config.mongo_uri)
  .then(() => console.log("Conectado a la base de datos"))
  .catch((error) => console.error(error));