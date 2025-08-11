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
  notebookController,
  walletController,
  wishlistController,
  discussionController,
  liveSessionController,
  assignmentController,
  assignmentSubmissionController,
  subscriptionPlanController,
  topicController,
  quizController,
  quizSubmissionController,
} from "../dependencyInjector";

//middlewares
import multerUpload from "../config/multer";
import { accessTokenValidator } from "../middlewares/userAuth.middleware";
import upload from "../config/multer";

router.get("/categories", categoryController.getAllCategories);

router.get("/topics", topicController.getAllTopics);
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

router
  .route("/courses/:courseId/reviews/:reviewId")
  .delete(accessTokenValidator, reviewController.deleteReview)
  .put(accessTokenValidator, reviewController.updateReview);

router
  .route("/courses/:courseId/reviews/:reviewId/replies")
  .post(accessTokenValidator, reviewController.addReply)
  .get(reviewController.getReplies);

router.get("/trainers", trainerController.getAllTrainers);
router.get("/trainers/:trainerId", trainerController.getTrainer);

//** Routes for only authenticated users */
//setting middleware
router.use(accessTokenValidator);

// router.post(
//   "/courses/:courseId/payment",
//   enrolledCourseController.completePurchase
// );

router.get("/courses/:courseId/access", enrolledCourseController.checkEnrolled);

router
  .route("/courses/:courseId/liveSessions")
  .get(liveSessionController.getLiveSessions);

router
  .route("/courses/:courseId/assignments")
  .get(assignmentController.getUserAssignments);

router
  .route("/courses/:courseId/assignments/:assignmentId")
  .put(
    multerUpload.single("file"),
    assignmentSubmissionController.resubmitAssignment
  )
  .post(
    multerUpload.single("file"),
    assignmentSubmissionController.submitAssignment
  );

//enrolled courses
router.get("/enrolledCourses", enrolledCourseController.getEnrolledCourses);

router.get(
  "/enrolledCourses/progress",
  enrolledCourseController.getCompletionProgress
);

router.get(
  "/enrolledCourses/completed",
  enrolledCourseController.getCompletedEnrolledCourses
);

router
  .route("/enrolledCourses/:courseId")
  .get(enrolledCourseController.getEnrolledCourseCompletionStatus);

router
  .route("/enrolledCourses/:courseId/certificate")
  .get(courseController.getCourseCertificateDetails);

router
  .route("/enrolledCourses/:courseId/recorded")
  .get(enrolledCourseController.getEnrolledCourse);

router
  .route("/enrolledCourses/:courseId/lessons/:lessonId")
  .get(lessonController.getLesson)
  .patch(enrolledCourseController.completeUnCompleteLesson);

router
  .route("/enrolledCourses/:courseId/notebooks")
  .get(notebookController.getCourseNotebooks)
  .post(notebookController.addNotebook);

router
  .route("/enrolledCourses/:courseId/notebooks/:notebookId")
  .put(notebookController.updateNotebook)
  .delete(notebookController.deleteNotebook);

//profile
router
  .route("/profile")
  .get(userController.getProfile)
  .patch(multerUpload.single("image"), userController.changeProfileImage)
  .put(userController.updateProfile);

router.get("/profile/check", userController.checkUserCompletedProfile);

//transactions
router.get("/transactions", transactionController.getUserTransactions);
router.patch(
  "/transactions/:transactionId",
  transactionController.cancelCoursePurchase
);

//trainer request
router
  .route("/trainerRequest")
  .put(userController.resendTrainerRequest)
  .post(userController.sendTrainerRequest)
  .get(userController.getPreviousTrainerRequestDetails);

//subscriptions
router
  .route("/subscription")
  .get(subscriptionController.getSubscriptionDetail)
  .post(subscriptionController.createSubscriptionOrder);

router
  .route("/subscriptionPlans")
  .get(subscriptionPlanController.getAllSubscriptionPlans);

router
  .route("/subscriptionPlans/:subscriptionPlanId")
  .post(subscriptionController.createSubscriptionOrder);

// post(subscriptionController.completeSubscription);

// router.get(
//   "/subscription/detail",
//   subscriptionController.getSubscriptionDetail
// );

//chats
router.route("/chats").get(chatController.getChats);
// .get(subscriptionValidator, chatController.getUserChats)

router.route("/chats/new/:trainerId").get(chatController.chat);

router
  .route("/chats/:chatId")
  .get(chatController.getChatMessages)
  .post(upload.single("file"), chatController.sendMedia);

router.route("/chats/:chatId/members").get(chatController.getChatMembers);
// .get(chatController.getMessages);

//stream
router.route("/streams").get(streamController.getStreams);
router.route("/streams/:streamId").get(streamController.viewStream);

router
  .route("/wallet")
  .get(walletController.getWalletInfo)
  .patch(walletController.redeem);
router.route("/wallet/account").patch(walletController.setUpStripeAccount);
router.route("/wallet/history").get(transactionController.getUserWalletHistory);

router
  .route("/wishlist")
  .post(wishlistController.addToWishlist)
  .get(wishlistController.getUserWishlist);

router
  .route("/wishlist/course/:courseId")
  .get(wishlistController.checkCourseAddedToWishlist)
  .delete(wishlistController.removeCourseFromWishlist);

router
  .route("/wishlist/:wishlistId")
  .delete(wishlistController.removeFromWishlist);

router
  .route("/discussions")
  .get(discussionController.getDiscussions)
  .post(discussionController.createDiscussion);

router
  .route("/discussions/:discussionId")
  .get(discussionController.getReplies)
  .post(discussionController.addReply)
  .patch(discussionController.editDiscussion)
  .delete(discussionController.deleteDiscussion);

router.route("/quizzes").get(quizController.getUserQuizzes);
router
  .route("/quizzes/progress")
  .get(quizSubmissionController.getUserQuizSubmissionsProgress);
router.route("/quizzes/:quizId").get(quizController.getUserQuiz);
router
  .route("/quizzes/:quizId/submissions")
  .get(quizSubmissionController.getQuizSubmission)
  .post(quizSubmissionController.submitQuiz);
router
  .route("/quizzes/:quizId/submissions/:quizSubmissionId")
  .put(quizSubmissionController.resubmitQuiz);

export default router;
