import express from "express";
import User from "../models/user.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import cors from "cors";
import userService from "../service/userService.js";

const router = express.Router();

router.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      
    })
  );


router.get("/deneme", async (req, res) => {
    res.send("deneme");
})

router.post("/createuser", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const userData = {
            ...req.body,
            userId: req.auth.userId
        };
        const savedUser = await userService.createOrUpdateUser(userData);
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı oluşturulamadı", error: error.message });
    }
});

router.post("/updatePlan", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const updatedUser = await userService.updateUserPlan(req.auth.userId, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı planı güncellenemedi", error: error.message });
    }
});

router.put("/updatecredits", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const updatedUser = await userService.updateUserCredits(req.auth.userId, req.body.credits);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı bilgileri güncellenemedi", error: error.message });
    }
});

router.get("/getUserInfo", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const user = await userService.getUserInfo(req.auth.userId);
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı bilgileri getirilemedi", error: error.message });
    }
});

router.put("/subscription/:userId", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const updatedUser = await userService.updateSubscription(req.params.userId, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Abonelik güncellenemedi", error: error.message });
    }
});

router.put("/weeklySpin", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const updatedUser = await userService.updateWeeklySpin(req.auth.userId, req.body.canWeeklySpin);
        if (!updatedUser) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Çark hakkı güncellenemedi", error: error.message });
    }
});

export default router;
