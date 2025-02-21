import { Router } from "express";

const router = Router();

//models
import UserModel from "../models/User.model";

//repositories
import UserRepository from "../repositories/user.repository";

//services
import ProfileService from "../services/profile.service";

//controllers
import ProfileController from "../controllers/profile.controller";

//middlewares
import multerUpload from "../config/multer";
import { accessTokenValidator } from "../middlewares/userAuthMiddleware";

const userRepository = new UserRepository(UserModel);
const profileService = new ProfileService(userRepository);
const profileController = new ProfileController(profileService);

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
