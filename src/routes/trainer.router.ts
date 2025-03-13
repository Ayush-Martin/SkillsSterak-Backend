import { Router } from "express";

const router = Router();
import {
  courseController,
  lessonController,
  moduleController,
  trainerController,
  walletController,
} from "../dependencyInjector";

//middlewares
import { trainerAuthMiddleware } from "../middlewares/trainerAuth.middleware";
import upload from "../config/multer";

//setting middleware
router.use(trainerAuthMiddleware);

router
  .route("/courses")
  .get(courseController.getTrainerCourses)
  .post(upload.single("image"), courseController.createCourse);

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

router.get("/students", trainerController.getStudentsWithEnrolledCourses);

router.route("/wallet").get(walletController.getWalletInfo);

export default router;
