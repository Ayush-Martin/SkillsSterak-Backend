import { Router } from "express";
const router = Router();

import { authController, otpController } from "../dependencyInjector";

//middlewares
import {
  accessTokenValidator,
  refreshTokenValidator,
} from "../middlewares/userAuth.middleware";

router
  .route("/register")
  .post(authController.register)
  .get(authController.completeRegister);
 
//router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/logout", authController.logout);

// router.post("/completeRegister", authController.completeRegister);

router.post("/forgetPassword", authController.forgetPassword);

router.post("/verifyOTP", otpController.verifyOTP);

router.get("/resendOTP/:email", otpController.resendOTP);

router.post("/resetPassword", authController.resetPassword);

router.patch(
  "/changePassword",
  accessTokenValidator,
  authController.changePassword
);

router.post("/google", authController.googleAuth);

router.use(refreshTokenValidator).get("/refresh", authController.refresh);

export default router;
