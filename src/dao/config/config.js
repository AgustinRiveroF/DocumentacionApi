import mongoose from "mongoose";
import dotenv from 'dotenv';
import config from "../config/config.js";
import { logger } from "../../utils/logger.js";


dotenv.config();

export default {
    mongo_uri: process.env.MONGO_URI,
    port: process.env.PORT,
    secret_jwt: process.env.SECRET_KEY_JWT,
    google_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_id: process.env.GOOGLE_CLIENT_ID,
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
    nodemailer_user: process.env.NODEMAILER_USER,
    nodemailer_password: process.env.NODEMAILER_PASSWORD,
    twilio_account: process.env.TWILIO_ACCOUNT_SID,
    twilio_auth: process.env.TWILIO_AUTH,
    twilio_phone: process.env.TWILIO_PHONE_NUMBER,
    twilio_whatsapp_number: process.env.TWILIO_WHATSAPP_NUMBER,
    enviroment: process.env.ENVIROMENT
};


mongoose
  .connect(config.mongo_uri)
  .then(() => logger.info("Conectado a la base de datos"))
  .catch((error) => logger.error(error)); 


  
