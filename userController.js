import express from "express";
import User from "./models/user.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import cors from "cors";

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
// Yeni kullanıcı oluşturma
router.post("/createuser", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const { name, email, birthDate, birthTime, isFirstTime, zodiacSign, subscription } = req.body;
        const userId = req.auth.userId;

        console.log(birthTime,"birthTime");
        console.log(birthDate,"birthDate");
        
        const existingUser = await User.findOne({ userId });
        let savedUser;
        
        if (existingUser) {
            savedUser = await User.findOneAndUpdate(
                { userId },
                {
                    name,
                    email,
                    birthDate,
                    birthTime,
                    isFirstTime: false,
                    subscription: existingUser.subscription,
                    subscriptionEndDate: existingUser.subscriptionEndDate,
                    canWeeklySpin: existingUser.canWeeklySpin,
                    zodiacSign: zodiacSign,
                },
                { new: true }
            );
        } else {
            const newUser = new User({
                name,
                userId,
                email, 
                birthDate,
                birthTime,
                isFirstTime: false,
                subscription: subscription,
                subscriptionEndDate: "",
                canWeeklySpin: true,
                zodiacSign: zodiacSign,
            });
            savedUser = await newUser.save();
        }

        
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı oluşturulamadı", error: error.message });
    }
});

// Kullanıcı bilgilerini getirme
router.get("/getUserInfo", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await User.findOne({ userId: userId });
        console.log(user,"user");
        
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı bilgileri getirilemedi", error: error.message });
    }
});

// Kullanıcı aboneliğini güncelleme
router.put("/subscription/:userId", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const { subscription, subscriptionEndDate } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { subscription, subscriptionEndDate },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Abonelik güncellenemedi", error: error.message });
    }
});

// Haftalık çark hakkını güncelleme
router.put("/weeklySpin/:userId", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const { canWeeklySpin } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { canWeeklySpin },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Çark hakkı güncellenemedi", error: error.message });
    }
});

export default router;
