import { Router } from "express";
const router = Router();

//models
import User from "../models/User.model";
import RefreshToken from "../models/RefreshToken.model";

//repositories
import UserRepository from "../repositories/user.repository";
import OTPRepository from "../repositories/OTP.repository";
import RefreshTokenRepository from "../repositories/RefreshToken.repository";

//services
import AuthService from "../services/auth.service";
import RefreshTokenService from "../services/RefreshToken.service";

//controllers
import AuthController from "../controllers/auth.controller";

//middleware
import {
  accessTokenValidator,
  refreshTokenValidator,
} from "../middlewares/userAuthMiddleware";

const userRepository = new UserRepository(User);
const otpRepository = new OTPRepository();
const refreshTokenRepository = new RefreshTokenRepository(RefreshToken);

const authService = new AuthService(userRepository, otpRepository);
const refreshTokenService = new RefreshTokenService(refreshTokenRepository);

const authController = new AuthController(
  authService,
  refreshTokenService
);

router.post("/register", authController.register.bind(authController));

router.post("/login", authController.login.bind(authController));

router.get("/logout", authController.logout.bind(authController));

router.post(
  "/completeRegister",
  authController.completeRegister.bind(authController)
);

router.post(
  "/forgetPassword",
  authController.forgetPassword.bind(authController)
);

router.post("/verifyOTP", authController.verifyOTP.bind(authController));

router.post(
  "/resetPassword",
  authController.resetPassword.bind(authController)
);

router.post("/google", authController.googleAuth.bind(authController));

router.get(
  "/refresh",
  refreshTokenValidator,
  authController.refresh.bind(authController)
);

export default router;
