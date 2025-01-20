import userService from '../service/userService.js';

export const createUser = async (req, res) => {
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
};

export const updateUserPlan = async (req, res) => {
    try {
        const updatedUser = await userService.updateUserPlan(req.auth.userId, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı planı güncellenemedi", error: error.message });
    }
};

export const updateUserCredits = async (req, res) => {
    try {
        const updatedUser = await userService.updateUserCredits(req.auth.userId, req.body.credits);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı bilgileri güncellenemedi", error: error.message });
    }
};

export const addUserCredits = async (req, res) => {
    try {
        const updatedUser = await userService.addUserCredits(req.auth.userId, req.body.credits);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı bilgileri güncellenemedi", error: error.message });
    }
};

export const getUserInfo = async (req, res) => {
    try {
        const user = await userService.getUserInfo(req.auth.userId);
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı bilgileri getirilemedi", error: error.message });
    }
};

export const updateSubscription = async (req, res) => {
    try {
        const updatedUser = await userService.updateSubscription(req.params.userId, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Abonelik güncellenemedi", error: error.message });
    }
};

export const updateWeeklySpin = async (req, res) => {
    try {
        const updatedUser = await userService.updateWeeklySpin(req.auth.userId, req.body.canWeeklySpin);
        if (!updatedUser) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Çark hakkı güncellenemedi", error: error.message });
    }
};