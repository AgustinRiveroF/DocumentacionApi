import mongoose from "mongoose";
import dotenv from 'dotenv'
import config from "../config/config.js"

dotenv.config();

export default {
    mongo_uri: process.env.MONGO_URI,
    port: process.env.PORT,
    secret_jwt: process.env.SECRET_KEY_JWT,
    google_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_id: process.env.GOOGLE_CLIENT_ID,
};


mongoose
  .connect(config.mongo_uri)
  .then(() => console.log("Conectado a la base de datos"))
  .catch((error) => console.log(error)); 


  
