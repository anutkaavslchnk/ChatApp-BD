import express from 'express';
import { protectRoute } from '../middlewares/auth.js';
import { getUsersController,getMsgController,sendMsgController } from '../controllers/getUsers.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
const router=express.Router();
router.get("/user", protectRoute, ctrlWrapper(getUsersController));
router.get("/:id", protectRoute, ctrlWrapper(getMsgController))
router.post("/send/:id", protectRoute, ctrlWrapper(sendMsgController))
export default router;