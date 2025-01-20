import express from 'express';
import userRoutes from './userRoutes.js';
import chatRoutes from './chatRoutes.js';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/chat', chatRoutes);

export default router;