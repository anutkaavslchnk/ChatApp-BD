import express from 'express';
import { protectRoute } from '../middlewares/auth.js';
import { getUsersController,getMsgController,sendMsgController } from '../controllers/getUsers.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { updateStatusOfDelivered, updateStatusOfRead } from '../services/msg.js';
const router=express.Router();
router.get("/user", protectRoute, ctrlWrapper(getUsersController));
router.get("/:id", protectRoute, ctrlWrapper(getMsgController))
router.post("/send/:id", protectRoute, ctrlWrapper(sendMsgController))
router.patch("/:idMsg/isDelivered", protectRoute, ctrlWrapper(updateStatusOfDelivered))

router.patch("/:idMsg/isRead", protectRoute, ctrlWrapper(updateStatusOfRead))
export default router; 