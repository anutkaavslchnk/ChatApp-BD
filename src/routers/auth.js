import express from "express";
import { loginController, logoutController, signUpController } from "../controllers/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createUserSchemma } from "../validation/auth.js";

const router=express.Router();

router.post("/signup", validateBody(createUserSchemma), ctrlWrapper(signUpController));

router.post("/login", ctrlWrapper(loginController));

router.post("/logout", ctrlWrapper(logoutController));

export default router;