import { Router } from "express";

const router = Router();
import {
  categoryController,
  courseController,
  subscriptionController,
  subscriptionPlanController,
  topicController,
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
router.route("/users/count").get(userController.getUsersCount);

router
  .route("/users/:userId")
  .patch(userController.blockUnblockUser)
  .get(userController.getAdminUserProfile);

//trainer requests
router
  .route("/trainerRequests")
  .get(trainerRequestController.getTrainerRequests);

//transactions
router.get("/transactions", transactionController.getTransactions);

//revenue
router.get("/revenue", transactionController.getAdminRevenue);
router.get("/revenue/export", transactionController.exportAdminRevenue);
router.get("/revenue/graph", transactionController.getAdminRevenueGraphData);

//trainer requests
router
  .route("/trainerRequests/:trainerRequestId")
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
router.get("/courses/top5", courseController.getAdminTop5Courses);
router.get("/courses/count", courseController.getAdminCoursesCount);

router
  .route("/courses/:courseId")
  .patch(courseController.listUnListCourse)
  .get(courseController.getAdminCourse);

router.patch("/courses/:courseId/status", courseController.approveRejectCourse);

router
  .route("/subscriptionPlans")
  .get(subscriptionPlanController.getSubscriptionPlans)
  .post(subscriptionPlanController.createSubscriptionPlan);

router
  .route("/subscriptionPlans/:subscriptionPlanId")
  .put(subscriptionPlanController.editSubscriptionPlan)
  .patch(subscriptionPlanController.listUnlistSubscriptionPlan);

router.route("/subscriptions").get(subscriptionController.getSubscribedUsers);
router
  .route("/subscriptions/plans")
  .get(subscriptionPlanController.getAllSubscriptionPlans);

router
  .route("/topics")
  .get(topicController.getTopics)
  .post(topicController.addTopic);
  
router.route("/topics/:topicId").put(topicController.editTopic);

export default router;
