import { Router } from "express";
import chatController from "../controllers/chat.controller.js"

const router = Router()

router.get("/", chatController.chat)
  
export default router