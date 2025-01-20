import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { 
    getChats, 
    createChat, 
    getChatById, 
    updateChat, 
    deleteChat 
} from '../controller/chatController.js';

const router = express.Router();

router.get("/getchats", requireAuth, getChats);
router.post("/createchat", requireAuth, createChat);
router.post("/getchat/:chatId", requireAuth, getChatById);
router.put("/updatechat/:chatId", requireAuth, updateChat);
router.delete("/deletechat/:chatId", requireAuth, deleteChat);

export default router;