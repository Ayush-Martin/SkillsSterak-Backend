import { Router } from "express";

const router = Router();

//models
import UserModel from "../models/User.model";

//repositories
import UserRepository from "../repositories/user.repository";

//services
import UserService from "../services/user.service";

//controllers
import ProfileController from "../controllers/user/profile.controller";

//middlewares
import multerUpload from "../config/multer";
import { accessTokenValidator } from "../middlewares/userAuthMiddleware";

const userRepository = new UserRepository(UserModel);
const userService = new UserService(userRepository);
const profileController = new ProfileController(userService);

router.use(accessTokenValidator);

router.put(
  "/changeProfileImage",
  multerUpload.single("image"),
  profileController.changeProfileImage.bind(profileController)
);

router.put(
  "/updateProfile",
  profileController.updateProfile.bind(profileController)
);

export default router;
