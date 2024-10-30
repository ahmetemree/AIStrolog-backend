import express from "express";
import User from "./models/user.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = express.Router();


router.get("/deneme", async (req, res) => {
    res.send("deneme");
})
// Yeni kullanıcı oluşturma
router.post("/", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const { name, email, birthDate } = req.body;
        const userId = req.auth.userId;

        const newUser = new User({
            name,
            email,
            birthDate,
            subscription: "free",
            subscriptionEndDate: new Date(Date.now() + 30*24*60*60*1000), // 30 gün sonra
            canWeeklySpin: true
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı oluşturulamadı", error: error.message });
    }
});

// Kullanıcı bilgilerini getirme
router.get("/:userId", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId });
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
