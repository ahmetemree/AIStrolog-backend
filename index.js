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
app.use(clerkMiddleware())

app.get("/deneme",requireAuth({signInUrl:'/sign-in'}), async (req, res,) => {
  res.send("deneme");
});

app.get('/sign-in', (req, res) => {
  // Assuming you have a template engine installed and are using a Clerk JavaScript SDK on this page
  res.redirect(process.env.CLIENT_URL + '/login')
})

app.get("/getchats", requireAuth({signInUrl:'/sign-in'}), async (req, res,) => {
  
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ message: "Kullanıcı kimliği doğrulanamadı" });
    }
  console.log(userId);
  try {
    const userChats = await UserChats.find({ userId: userId });
    res.status(200).json(userChats);
    
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user chats" });
  }
});



app.post("/createchat", requireAuth({signInUrl:'/sign-in'}), async (req, res) => {
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

app.post("/getchat/:chatId", requireAuth({signInUrl:'/sign-in'}), async (req, res) => {
  
  const { chatId } = req.params;
  const userId = req.auth.userId;
  console.log("chatId:",chatId);
  try {
    const chat = await Chat.findOne({ chatId: chatId, userId: userId });
    console.log("chat:",chat);
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Failed to get chat" });
  }
});

app.put("/updatechat/:chatId", requireAuth({signInUrl:'/sign-in'}), async (req, res) => {
  const { role,parts,chatId } = req.body;
  const userId = req.auth.userId;
  console.log("userIddavam:",userId);
  
  try {
    await Chat.findOneAndUpdate(
      { chatId: chatId, userId: userId },
      { $push: { history: { role: role, parts: parts } } },
      { new: true }
    );
    res.status(200).json({ message: "Chat updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update chat" });
  }
});




app.delete("/deletechat/:chatId", requireAuth({signInUrl:'/sign-in'}), async (req, res) => {
  const { chatId } = req.params;
  const userId = req.auth.userId;
  try {
    await UserChats.findOneAndDelete({ "chats._id": chatId, userId: userId });
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
