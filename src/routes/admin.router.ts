import { Router } from "express";

const router = Router();

//models
import UserModel from "../models/User.model";
import TrainerRequestModel from "../models/TrainerRequest.model";

//repositories
import UserRepository from "../repositories/user.repository";
import TrainerRepository from "../repositories/trainer.repository";
import TrainerRequestRepository from "../repositories/trainerRequest.repository";

//services
import UserService from "../services/user.service";
import TrainerService from "../services/trainer.service";

//controllers
import UserController from "../controllers/user.controller";
import TrainerRequestController from "../controllers/trainerRequest.controller";

//middlewares
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";

const userRepository = new UserRepository(UserModel);
const trainerRepository = new TrainerRepository(UserModel);
const trainerRequestRepository = new TrainerRequestRepository(
  TrainerRequestModel
);

const userService = new UserService(userRepository, trainerRequestRepository);
const trainerService = new TrainerService(
  trainerRepository,
  trainerRequestRepository
);

const userController = new UserController(userService);
const trainerRequestController = new TrainerRequestController(trainerService);

//setting middleware
router.use(adminAuthMiddleware);

router.route("/users").get(userController.getUsers.bind(userController));

router
  .route("/users/:userId")
  .patch(userController.blockUnblockUser.bind(userController));

router
  .route("/trainerRequests")
  .get(
    trainerRequestController.getTrainerRequests.bind(trainerRequestController)
  );

router
  .route("/trainerRequests/:userId")
  .patch(
    trainerRequestController.approveRejectRequests.bind(
      trainerRequestController
    )
  );

export default router;
