import { Router } from "express";
import authRoutes from "./auth.js";
import msgRoutes from "./msg.js";
const router=Router();

router.use('/api/auth',authRoutes);
router.use('/api/message',msgRoutes);

export default router;