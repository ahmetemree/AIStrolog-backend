import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    createUser,
    updateUserPlan,
    updateUserCredits,
    getUserInfo,
    updateSubscription,
    updateWeeklySpin
} from '../controller/userController.js';

const router = express.Router();

router.post("/createuser", requireAuth, createUser);
router.post("/updatePlan", requireAuth, updateUserPlan);
router.put("/updatecredits", requireAuth, updateUserCredits);
router.get("/getUserInfo", requireAuth, getUserInfo);
router.put("/subscription/:userId", requireAuth, updateSubscription);
router.put("/weeklySpin", requireAuth, updateWeeklySpin);

export default router;