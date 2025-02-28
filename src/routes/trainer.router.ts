import { Router } from "express";

const router = Router();

//models
import CourseModel from "../models/Course.model";
import ModuleModel from "../models/Module.model";

//repositories
import CourseRepository from "../repositories/course.repository";
import ModuleRepository from "../repositories/Module.repository";

//services
import CourseService from "../services/course.service";
import ModuleService from "../services/module.service";

//controllers
import CourseController from "../controllers/course.controller";
import ModuleController from "../controllers/module.controller";

//middlewares
import { trainerAuthMiddleware } from "../middlewares/trainerAuth.middleware";
import upload from "../config/multer";

const courseRepository = new CourseRepository(CourseModel);
const moduleRepository = new ModuleRepository(ModuleModel);

const courseService = new CourseService(courseRepository);
const moduleService = new ModuleService(moduleRepository);

const courseController = new CourseController(courseService);
const moduleController = new ModuleController(moduleService);

//setting middleware
router.use(trainerAuthMiddleware);

router
  .route("/courses")
  .get(courseController.getCourses.bind(courseController))
  .post(
    upload.single("image"),
    courseController.createCourse.bind(courseController)
  );

router
  .route("/courses/:courseId")
  .get(moduleController.getModules.bind(moduleController))
  .post(moduleController.addModule.bind(moduleController));

router
  .route("/module/:moduleId")
  .delete(moduleController.deleteModule.bind(moduleController))
  .get(moduleController.getModule.bind(moduleController))
  .patch(moduleController.updateTitle.bind(moduleController));

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

export default router;
