import { Router } from "express";

const router = Router();
import {
  courseController,
  lessonController,
  moduleController,
  streamController,
  trainerController,
  transactionController,
  walletController,
} from "../dependencyInjector";

//middlewares
import { trainerAuthMiddleware } from "../middlewares/trainerAuth.middleware";
import upload from "../config/multer";

//setting middleware
router.use(trainerAuthMiddleware);

//courses
router
  .route("/courses")
  .get(courseController.getTrainerCourses)
  .post(upload.single("image"), courseController.createCourse);

router.get("/courses/count", courseController.getTrainerCoursesCount);
router.get("/courses/top5", courseController.getTrainerTop5Courses);

router
  .route("/courses/:courseId")
  .get(courseController.getTrainerCourse)
  .patch(courseController.listUnListCourse);

router.patch(
  "/courses/:courseId/image",
  upload.single("image"),
  courseController.changeCourseThumbnail
);

router.put(
  "/courses/:courseId/basicDetails",
  courseController.updateCourseBasicDetails
);

router.patch(
  "/courses/:courseId/requirements",
  courseController.updateCourseRequirements
);

router.patch(
  "/courses/:courseId/skillsCovered",
  courseController.updateCourseSkillsCovered
);

router
  .route("/courses/:courseId/modules")
  .get(moduleController.getModules)
  .post(moduleController.addModule);

router
  .route("/courses/:courseId/modules/:moduleId")
  .delete(moduleController.deleteModule)
  .get(moduleController.getModule)
  .patch(moduleController.updateTitle)
  .post(upload.single("file"), lessonController.addLesson);

router
  .route("/courses/:courseId/modules/:moduleId/:lessonId")
  .delete(lessonController.deleteLesson)
  .put(lessonController.updateLessonDetails)
  .patch(upload.single("file"), lessonController.updateLessonFile);

router
  .route("/courses/:courseId/live")
  .post(upload.single("thumbnail"), streamController.startStream)
  .get(streamController.getStreams);

//students
router.get("/students", trainerController.getStudentsWithEnrolledCourses);
router.get("/students/count", trainerController.getStudentsCount);

//wallet
router.route("/wallet").get(walletController.getWalletInfo);

// router.route("/chats").get(chatController.getTrainerChats);

//stream
router
  .route("/stream")
  .post(upload.single("thumbnail"), streamController.startStream);

router.route("/streams/:roomId").patch(streamController.endStream);

router.get("/revenue", transactionController.getTrainerRevenue);
router.get("/revenue/export", transactionController.exportTrainerRevenue);
router.get("/revenue/graph", transactionController.getTrainerRevenueGraphData);

export default router;
