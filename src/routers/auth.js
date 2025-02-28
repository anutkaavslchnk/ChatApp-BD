import express from "express";
import { loginController, logoutController, refreshUserSessionController, signUpController } from "../controllers/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createUserSchemma, loginUserSchema } from "../validation/auth.js";

const router=express.Router();

router.post("/signup", validateBody(createUserSchemma), ctrlWrapper(signUpController));

router.post("/login", validateBody(loginUserSchema), ctrlWrapper(loginController));

router.post("/logout", ctrlWrapper(logoutController));
router.post('/refresh', ctrlWrapper(refreshUserSessionController));

export default router;