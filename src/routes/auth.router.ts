import { Router } from "express";
const router = Router();

//models
import User from "../models/User.model";

//repositories
import UserRepository from "../repositories/user.repository";
import OTPRepository from "../repositories/OTP.repository";

//services
import UserService from "../services/user.service";
import OTPService from "../services/OTP.service";

//controllers
import AuthController from "../controllers/auth.controller";

const userRepository = new UserRepository(User);
const otpRepository = new OTPRepository();
const userService = new UserService(userRepository);
const otpService = new OTPService(otpRepository);
const authController = new AuthController(userService, otpService);

router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post(
  "/completeRegister",
  authController.completeRegister.bind(authController)
);

export default router;
