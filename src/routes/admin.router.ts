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
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware";
import CategoryController from "../controllers/category.controller";
import CategoryService from "../services/category.service";
import CategoryRepository from "../repositories/category.repository";
import CategoryModel from "../models/Category.model";

const userRepository = new UserRepository(UserModel);
const trainerRepository = new TrainerRepository(UserModel);
const trainerRequestRepository = new TrainerRequestRepository(
  TrainerRequestModel
);
const categoryRepository = new CategoryRepository(CategoryModel);

const userService = new UserService(userRepository, trainerRequestRepository);
const trainerService = new TrainerService(
  trainerRepository,
  trainerRequestRepository
);
const categoryService = new CategoryService(categoryRepository);

const userController = new UserController(userService);
const trainerRequestController = new TrainerRequestController(trainerService);
const categoryController = new CategoryController(categoryService);

//setting middleware
// router.use(adminAuthMiddleware);

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

router
  .route("/categories")
  .get(categoryController.getCategories.bind(categoryController))
  .post(categoryController.addCategory.bind(categoryController));

router
  .route("/categories/all")
  .get(categoryController.getAllCategories.bind(categoryController));

router
  .route("/categories/:categoryId")
  .patch(categoryController.listUnListCategory.bind(categoryController))
  .put(categoryController.editCategory.bind(categoryController));

export default router;
