import { Router } from "express";

const router = Router();
import {
  categoryController,
  courseController,
  trainerRequestController,
  transactionController,
  userController,
} from "../dependencyInjector";

//middlewares
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware";

// setting middleware
router.use(adminAuthMiddleware);

//users
router.route("/users").get(userController.getUsers);

router.route("/users/:userId").patch(userController.blockUnblockUser);

//trainer requests
router
  .route("/trainerRequests")
  .get(trainerRequestController.getTrainerRequests);

//transactions
router.get("/transactions", transactionController.getTransactions);

//trainer requests
router
  .route("/trainerRequests/:userId")
  .patch(trainerRequestController.approveRejectRequests);

//categories
router
  .route("/categories")
  .get(categoryController.getCategories)
  .post(categoryController.addCategory);

router.route("/categories/all").get(categoryController.getAllCategories);

router
  .route("/categories/:categoryId")
  .patch(categoryController.listUnListCategory)
  .put(categoryController.editCategory);

//courses
router.get("/courses", courseController.getAdminCourses);

router.patch("/courses/:courseId", courseController.listUnListCourse);

router.patch("/courses/:courseId/status", courseController.approveRejectCourse);

export default router;
