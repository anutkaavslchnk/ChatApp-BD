import { Router } from "express";
import authRoutes from "./auth.js";
import msgRoutes from "./msg.js";
import conversationRoutes from './conversation.js';
const router=Router();

router.use('/api/auth',authRoutes);
router.use('/api/message',msgRoutes);
router.use('/api/conversation',conversationRoutes);
export default router;