import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { protectRoute } from '../middlewares/auth.js';
import { getConversationSummariesList } from '../controllers/getUsers.js';


const router=express.Router();
router.get('/summary/:userId', protectRoute, ctrlWrapper(getConversationSummariesList));


export default router;