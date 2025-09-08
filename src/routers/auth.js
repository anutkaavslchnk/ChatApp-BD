import express from "express";
import {
  checkController,
  loginController,
  logoutController,
  refreshUserSessionController,
  signUpController,
  updateProfileController,
} from "../controllers/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createUserSchemma, loginUserSchema } from "../validation/auth.js";
import { protectRoute } from "../middlewares/auth.js";
import {
  googleAuthController,
  googleSignUpController,
} from "../controllers/google.js";

const router = express.Router();
router.post("/google", ctrlWrapper(googleAuthController));
router.post("/google/signup", ctrlWrapper(googleSignUpController));
router.post(
  "/signup",
  validateBody(createUserSchemma),
  ctrlWrapper(signUpController)
);

router.post(
  "/login",
  validateBody(loginUserSchema),
  ctrlWrapper(loginController)
);

router.post("/logout", ctrlWrapper(logoutController));
router.post("/refresh", ctrlWrapper(refreshUserSessionController));

router.put(
  "/update-profile",
  protectRoute,
  ctrlWrapper(updateProfileController)
);
router.get("/check", protectRoute, ctrlWrapper(checkController));

export default router;
