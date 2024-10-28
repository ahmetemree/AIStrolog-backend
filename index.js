import mongoose from "mongoose";
import express from "express";
import ImageKit from "imagekit"
import cors from "cors";
import dotenv from "dotenv";
import 'dotenv/config'
import UserChats from "./models/userChat.js";
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
import { clerkMiddleware, requireAuth } from '@clerk/express'
import Chat from "./models/chat.js";
const app = express();
const port = 3002;
dotenv.config();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    
  })
);

app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to mongoDB");
  } catch (err) {
    console.log(err);
  }
};
app.use(clerkMiddleware());

// Tüm korumalı rotalar için bir middleware ekleyelim
const requireAuthMiddleware = (req, res, next) => {
  if (!req.auth?.userId) {
    return res.status(401).json({ 
      message: "Yetkilendirme başarısız. Lütfen giriş yapın.", 
      error: "AUTH_REQUIRED" 
    });
  }
  next();
};

app.get("/deneme", async (req, res,) => {

  res.send("deneme");
});


app.get("/getchats", 
  ClerkExpressWithAuth(), 
  requireAuthMiddleware,
  async (req, res,) => {

  
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ message: "Kullanıcı kimliği doğrulanamadı" });
    }
  try {
    const userChats = await UserChats.find({ userId: userId });
    res.status(200).json(userChats);
    
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user chats" });
  }
});



app.post("/createchat", 
  ClerkExpressWithAuth(), 
  requireAuthMiddleware,
  async (req, res) => {

  const { chatId, title, history } = req.body;
  const userId = req.auth.userId;
  const newChat = new UserChats({
    userId,
    chats: [{
      _id: chatId,
      title,
      createdAt: new Date()
    }]
  });
  const newDetailedChat = new Chat({
    userId,
    chatId,
    history
  });
  try {
    const savedChat = await newChat.save();
    
    const savedDetailedChat = await newDetailedChat.save();
    
    res.status(201).json(savedChat);
   
  } catch (error) {
    res.status(500).json({ message: "Failed to create user chat" });
  }
});

app.post("/getchat/:chatId", 
  ClerkExpressWithAuth(), 
  requireAuthMiddleware,
  async (req, res) => {
  
  const { chatId } = req.params;
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ chatId: chatId });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Failed to get chat" });
  }
});

app.put("/updatechat/:chatId", 
  ClerkExpressWithAuth(), 
  requireAuthMiddleware,
  async (req, res) => {
  const { role,parts,chatId } = req.body;
  const userId = req.auth.userId;
  try {
    await Chat.findOneAndUpdate(
      { chatId: chatId },
      { $push: { history: { role: role, parts: parts } } },
      { new: true }
    );
    res.status(200).json({ message: "Chat updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update chat" });
  }
});




app.delete("/deletechat/:chatId", 
  ClerkExpressWithAuth(), 
  requireAuthMiddleware,
  async (req, res) => {
  const { chatId } = req.params;
  const userId = req.auth.userId;
  try {
    await UserChats.findOneAndDelete({ "chats._id": chatId });
    await Chat.findOneAndDelete({ chatId: chatId });
    const userChats = await UserChats.find();
    res.status(200).json(userChats);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete chat" });
  }
  
}); 

app.listen(port, () => {
  connect();
  console.log(`Server is running at http://localhost:${port}`);
});
