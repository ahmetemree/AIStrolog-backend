import mongoose from "mongoose";
import express from "express";
import ImageKit from "imagekit"
import cors from "cors";
import dotenv from "dotenv";
import UserChats from "./models/userChat.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
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

app.get("/userchat",ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userChats = await UserChats.find();
    res.status(200).json(userChats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user chats" });
  }
});

app.post("/userchat", async (req, res) => {
  const { userId, chatId, title } = req.body;
  const newChat = new UserChats({
    userId,
    chats: [{
      _id: chatId,
      title,
      createdAt: new Date()
    }]
  });
  try {
    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    res.status(500).json({ message: "Failed to create user chat" });
  }
});

app.listen(port, () => {
  connect();
  console.log(`Server is running at http://localhost:${port}`);
});
