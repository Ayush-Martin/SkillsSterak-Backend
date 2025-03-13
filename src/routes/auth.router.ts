import { Router } from "express";
const router = Router();

import { authController } from "../dependencyInjector";

//middlewares
import { refreshTokenValidator } from "../middlewares/userAuth.middleware";

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/logout", authController.logout);

router.post("/completeRegister", authController.completeRegister);

router.post("/forgetPassword", authController.forgetPassword);

router.post("/verifyOTP", authController.verifyOTP);

router.post("/resetPassword", authController.resetPassword);

router.post("/google", authController.googleAuth);

router.use(refreshTokenValidator).get("/refresh", authController.refresh);

export default router;
