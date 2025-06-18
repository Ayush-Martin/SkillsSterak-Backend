import { Router } from "express";

const router = Router();

import {
  categoryController,
  courseController,
  enrolledCourseController,
  lessonController,
  chatController,
  reviewController,
  streamController,
  subscriptionController,
  trainerController,
  transactionController,
  userController,
} from "../dependencyInjector";

//middlewares
import multerUpload from "../config/multer";
import { accessTokenValidator } from "../middlewares/userAuth.middleware";
import { subscriptionValidator } from "../middlewares/subscriptionValidator.middleware";
import upload from "../config/multer";

router.get("/categories", categoryController.getAllCategories);
//course
router.get("/courses", courseController.getCourses);

router
  .route("/courses/:courseId")
  .get(courseController.getCourse)
  .post(accessTokenValidator, enrolledCourseController.enrollCourse);

router.route("/courses/:courseId/aiChat").post(courseController.aiChat);

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

router.get("/trainers", trainerController.getAllTrainers);
router.get("/trainers/:trainerId", trainerController.getTrainer);

//setting middleware
router.use(accessTokenValidator);

router.post(
  "/courses/:courseId/payment",
  enrolledCourseController.completePurchase
);

router.get("/courses/:courseId/access", enrolledCourseController.checkEnrolled);

//enrolled courses
router.get("/enrolledCourses", enrolledCourseController.getEnrolledCourses);

router.get(
  "/enrolledCourses/completed",
  enrolledCourseController.getCompletedEnrolledCourses
);

router
  .route("/enrolledCourses/:courseId")
  .get(enrolledCourseController.getEnrolledCourse)
  .delete(enrolledCourseController.cancelCoursePurchase);

router
  .route("/enrolledCourses/:courseId/lessons/:lessonId")
  .get(lessonController.getLesson)
  .patch(enrolledCourseController.completeUnCompleteLesson);

//profile
router
  .route("/profile")
  .patch(multerUpload.single("image"), userController.changeProfileImage)
  .put(userController.updateProfile);

//transactions
router.get("/transactions", transactionController.getUserTransactions);

//trainer request
router.get("/trainerRequest", userController.sendTrainerRequest);

//subscriptions
router
  .route("/subscription")
  .get(subscriptionController.createSubscriptionOrder)
  .post(subscriptionController.completeSubscription);

router.get(
  "/subscription/detail",
  subscriptionController.getSubscriptionDetail
);

//chats
router.route("/chats").get(chatController.getChats);
// .get(subscriptionValidator, chatController.getUserChats)

router.route("/chats/new/:trainerId").get(chatController.chat);

router
  .route("/chats/:chatId")
  .get(chatController.getChatMessages)
  .post(upload.single("file"), chatController.sendMedia);
// .get(chatController.getMessages);

//stream
router.route("/streams").get(streamController.getStreams);
router.route("/streams/:streamId").get(streamController.viewStream);

export default router;
