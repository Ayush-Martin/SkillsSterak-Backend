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
import AdminUserController from "../controllers/admin/adminUser.controller";
import AdminTrainerRequestController from "../controllers/admin/adminTrainerRequest.controller";

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

const adminUserController = new AdminUserController(userService);
const adminTrainerRequestController = new AdminTrainerRequestController(
  trainerService
);

router.use(adminAuthMiddleware);

router
  .route("/users")
  .get(adminUserController.getUsers.bind(adminUserController));

router
  .route("/users/:userId")
  .patch(adminUserController.blockUnblockUser.bind(adminUserController));

router
  .route("/trainerRequests")
  .get(
    adminTrainerRequestController.getTrainerRequests.bind(
      adminTrainerRequestController
    )
  );

router
  .route("/trainerRequests/:userId")
  .patch(
    adminTrainerRequestController.approveRejectRequests.bind(
      adminTrainerRequestController
    )
  );

export default router;
