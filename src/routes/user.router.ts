import { Router } from "express";

const router = Router();

import {
  categoryController,
  courseController,
  enrolledCourseController,
  lessonController,
  reviewController,
  subscriptionController,
  transactionController,
  userController,
} from "../dependencyInjector";

//middlewares
import multerUpload from "../config/multer";
import { accessTokenValidator } from "../middlewares/userAuth.middleware";
import { subscriptionValidator } from "../middlewares/subscriptionValidator.middleware";

router.get("/courses", courseController.getCourses);
router.get("/categories", categoryController.getAllCategories);

router
  .route("/courses/:courseId")
  .get(courseController.getCourse)
  .post(accessTokenValidator, enrolledCourseController.enrollCourse);

router
  .route("/courses/:courseId/reviews")
  .post(accessTokenValidator, reviewController.addReview)
  .get(reviewController.getReviews);

router.delete(
  "/courses/:courseId/reviews/:reviewId",
  accessTokenValidator,
  reviewController.deleteReview
);

router
  .route("/courses/:courseId/reviews/:reviewId/replies")
  .post(accessTokenValidator, reviewController.addReply)
  .get(reviewController.getReplies);

//setting middleware
router.use(accessTokenValidator);

router.post(
  "/courses/:courseId/payment",
  enrolledCourseController.completePurchase
);

router.get("/courses/:courseId/access", enrolledCourseController.checkEnrolled);

router.get("/enrolledCourses", enrolledCourseController.getEnrolledCourses);

router.get(
  "/enrolledCourses/completed",
  enrolledCourseController.getCompletedEnrolledCourses
);

router
  .route("/enrolledCourses/:courseId")
  .get(enrolledCourseController.getEnrolledCourse);

router
  .route("/enrolledCourses/:courseId/lessons/:lessonId")
  .get(lessonController.getLesson)
  .patch(enrolledCourseController.completeUnCompleteLesson);

router
  .route("/profile")
  .patch(multerUpload.single("image"), userController.changeProfileImage)
  .put(userController.updateProfile);

router.get("/transactions", transactionController.getUserTransactions);

router.get("/trainerRequest", userController.sendTrainerRequest);

router
  .route("/subscription")
  .get(subscriptionController.createSubscriptionOrder)
  .post(subscriptionController.completeSubscription);

router.get(
  "/subscription/detail",
  subscriptionController.getSubscriptionDetail
);

router.get("/chat", subscriptionValidator, (req, res) => {
  res.status(200).json({ message: "success" });
});
export default router;
