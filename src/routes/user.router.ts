import { Router } from "express";

const router = Router();

//models
import UserModel from "../models/User.model";
import TrainerRequestModel from "../models/TrainerRequest.model";

//repositories
import UserRepository from "../repositories/user.repository";
import TrainerRequestRepository from "../repositories/trainerRequest.repository";


//services
import UserService from "../services/user.service";

//controllers
import UserController from "../controllers/user/user.controller";

//middlewares
import multerUpload from "../config/multer";
import { accessTokenValidator } from "../middlewares/userAuthMiddleware";

const userRepository = new UserRepository(UserModel);
const trainerRequestRepository = new TrainerRequestRepository(
  TrainerRequestModel
);
const userService = new UserService(userRepository, trainerRequestRepository);
const userController = new UserController(userService);

router.use(accessTokenValidator);

router.put(
  "/changeProfileImage",
  multerUpload.single("image"),
  userController.changeProfileImage.bind(userController)
);

router.put("/updateProfile", userController.updateProfile.bind(userController));

router.get(
  "/trainerRequest",
  userController.sendTrainerRequest.bind(userController)
);

export default router;
