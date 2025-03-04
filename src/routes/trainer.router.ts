import { Router } from "express";

const router = Router();

//models
import CourseModel from "../models/Course.model";
import ModuleModel from "../models/Module.model";
import LessonModel from "../models/Lesson.model";

//repositories
import CourseRepository from "../repositories/course.repository";
import ModuleRepository from "../repositories/Module.repository";
import LessonRepository from "../repositories/Lesson.repository";

//services
import CourseService from "../services/course.service";
import ModuleService from "../services/module.service";
import LessonService from "../services/lesson.service";

//controllers
import CourseController from "../controllers/course.controller";
import ModuleController from "../controllers/module.controller";
import LessonController from "../controllers/lesson.controller";

//middlewares
import { trainerAuthMiddleware } from "../middlewares/trainerAuth.middleware";
import upload from "../config/multer";

const courseRepository = new CourseRepository(CourseModel);
const moduleRepository = new ModuleRepository(ModuleModel);
const lessonRepository = new LessonRepository(LessonModel);

const courseService = new CourseService(courseRepository);
const moduleService = new ModuleService(moduleRepository);
const lessonService = new LessonService(lessonRepository);

const courseController = new CourseController(courseService);
const moduleController = new ModuleController(moduleService);
const lessonController = new LessonController(lessonService);

//setting middleware
router.use(trainerAuthMiddleware);

router
  .route("/courses")
  .get(courseController.getTrainerCourses.bind(courseController))
  .post(
    upload.single("image"),
    courseController.createCourse.bind(courseController)
  );

router
  .route("/courses/:courseId")
  .get(courseController.getTrainerCourse.bind(courseController));

router.patch(
  "/courses/:courseId/image",
  upload.single("image"),
  courseController.changeCourseThumbnail.bind(courseController)
);

router.put(
  "/courses/:courseId/basicDetails",
  courseController.updateCourseBasicDetails.bind(courseController)
);

router.patch(
  "/courses/:courseId/requirements",
  courseController.updateCourseRequirements.bind(courseController)
);

router.patch(
  "/courses/:courseId/skillsCovered",
  courseController.updateCourseSkillsCovered.bind(courseController)
);

router
  .route("/courses/:courseId/modules")
  .get(moduleController.getModules.bind(moduleController))
  .post(moduleController.addModule.bind(moduleController));

router
  .route("/courses/:courseId/modules/:moduleId")
  .delete(moduleController.deleteModule.bind(moduleController))
  .get(moduleController.getModule.bind(moduleController))
  .patch(moduleController.updateTitle.bind(moduleController))
  .post(
    upload.single("file"),
    lessonController.addLesson.bind(lessonController)
  );

router
  .route("/courses/:courseId/modules/:moduleId/:lessonId")
  .delete(lessonController.deleteLesson.bind(lessonController));

export default router;
