import { Router } from "express";

const router = Router();

//models
import UserModel from "../models/User.model";
import TrainerRequestModel from "../models/TrainerRequest.model";
import TransactionModel from "../models/Transaction.model";
import CategoryModel from "../models/Category.model";
import CourseModel from "../models/Course.model";

//repositories
import UserRepository from "../repositories/user.repository";
import TrainerRepository from "../repositories/trainer.repository";
import TrainerRequestRepository from "../repositories/trainerRequest.repository";
import TransactionRepository from "../repositories/transaction.repository";
import CategoryRepository from "../repositories/category.repository";
import CourseRepository from "../repositories/course.repository";

//services
import UserService from "../services/user.service";
import TrainerService from "../services/trainer.service";
import TransactionService from "../services/transaction.service";
import CategoryService from "../services/category.service";
import CourseService from "../services/course.service";

//controllers
import UserController from "../controllers/user.controller";
import TrainerRequestController from "../controllers/trainerRequest.controller";
import TransactionController from "../controllers/transaction.controller";
import CategoryController from "../controllers/category.controller";
import CourseController from "../controllers/course.controller";

//middlewares
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware";

//repositories
const userRepository = new UserRepository(UserModel);
const trainerRepository = new TrainerRepository(UserModel);
const trainerRequestRepository = new TrainerRequestRepository(
  TrainerRequestModel
);
const categoryRepository = new CategoryRepository(CategoryModel);
const transactionRepository = new TransactionRepository(TransactionModel);
const courseRepository = new CourseRepository(CourseModel);

//services
const userService = new UserService(userRepository, trainerRequestRepository);
const trainerService = new TrainerService(
  trainerRepository,
  trainerRequestRepository
);
const categoryService = new CategoryService(categoryRepository);
const transactionService = new TransactionService(transactionRepository);
const courseService = new CourseService(courseRepository);

//controllers
const userController = new UserController(userService);
const trainerRequestController = new TrainerRequestController(trainerService);
const categoryController = new CategoryController(categoryService);
const transactionController = new TransactionController(transactionService);
const courseController = new CourseController(courseService);

// setting middleware
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

router.get(
  "/transactions",
  transactionController.getTransactions.bind(transactionController)
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

router.get("/courses", courseController.getAdminCourses.bind(courseController));

router.patch(
  "/courses/:courseId",
  courseController.listUnListCourse.bind(courseController)
);

router.patch(
  "/courses/:courseId/status",
  courseController.approveRejectCourse.bind(courseController)
);

export default router;
