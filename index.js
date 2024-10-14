import mongoose from "mongoose";
import express from "express";
import ImageKit from "imagekit"
import cors from "cors";
import dotenv from "dotenv";
import 'dotenv/config'
import UserChats from "./models/userChat.js";
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
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

app.post("/getchats", async (req, res,) => {
  
  const { userId } = req.body;
  console.log(userId);
  try {
    const userChats = await UserChats.find({ userId: userId });
    res.status(200).json(userChats);
    
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user chats" });
  }
});



app.post("/createchat", async (req, res) => {
  const { userId, chatId, title, history } = req.body;
  
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

app.post("/getchat/:chatId", async (req, res) => {
  
  const { chatId } = req.params;
  console.log("chatId:",chatId);
  try {
    const chat = await Chat.findOne({ chatId: chatId });
    console.log("chat:",chat);
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Failed to get chat" });
  }
});

app.put("/updatechat/:chatId", async (req, res) => {
  const { role,parts,chatId } = req.body;
  
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




app.delete("/deletechat/:chatId", async (req, res) => {
  const { chatId } = req.params;
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
