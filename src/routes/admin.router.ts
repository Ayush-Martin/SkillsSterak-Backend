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

router.route("/users").get(userController.getUsers);

router.route("/users/:userId").patch(userController.blockUnblockUser);

router
  .route("/trainerRequests")
  .get(trainerRequestController.getTrainerRequests);

router.get("/transactions", transactionController.getTransactions);

router
  .route("/trainerRequests/:userId")
  .patch(trainerRequestController.approveRejectRequests);

router
  .route("/categories")
  .get(categoryController.getCategories)
  .post(categoryController.addCategory);

router.route("/categories/all").get(categoryController.getAllCategories);

router
  .route("/categories/:categoryId")
  .patch(categoryController.listUnListCategory)
  .put(categoryController.editCategory);

router.get("/courses", courseController.getAdminCourses);

router.patch("/courses/:courseId", courseController.listUnListCourse);

router.patch("/courses/:courseId/status", courseController.approveRejectCourse);

export default router;
