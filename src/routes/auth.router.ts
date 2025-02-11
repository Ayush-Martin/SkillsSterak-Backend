import { Router } from "express";
const router = Router();

//models
import User from "../models/User.model";

//repositories
import UserRepository from "../repositories/user.repository";

//services
import UserService from "../services/user.service";

//controllers
import AuthController from "../controllers/auth.controller";

//middlewares

const userRepository = new UserRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService);

router.post("/register", authController.register.bind(authController));

export default router;
