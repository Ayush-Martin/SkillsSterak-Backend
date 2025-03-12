import { Router } from "express";

const router = Router();

//models
import CourseModel from "../models/Course.model";
import ModuleModel from "../models/Module.model";
import LessonModel from "../models/Lesson.model";
import WalletModel from "../models/Wallet.model";
import TransactionModel from "../models/Transaction.model";
import UserModel from "../models/User.model";
import TrainerRequestModel from "../models/TrainerRequest.model";

//repositories
import CourseRepository from "../repositories/course.repository";
import ModuleRepository from "../repositories/Module.repository";
import LessonRepository from "../repositories/Lesson.repository";
import WalletRepository from "../repositories/wallet.repository";
import TransactionRepository from "../repositories/transaction.repository";
import TrainerRepository from "../repositories/trainer.repository";
import TrainerRequestRepository from "../repositories/trainerRequest.repository";

//services
import CourseService from "../services/course.service";
import ModuleService from "../services/module.service";
import LessonService from "../services/lesson.service";
import WalletService from "../services/wallet.service";
import TrainerService from "../services/trainer.service";

//controllers
import CourseController from "../controllers/course.controller";
import ModuleController from "../controllers/module.controller";
import LessonController from "../controllers/lesson.controller";
import WalletController from "../controllers/wallet.controller";
import TrainerController from "../controllers/trainer.controller";

//middlewares
import { trainerAuthMiddleware } from "../middlewares/trainerAuth.middleware";
import upload from "../config/multer";

const courseRepository = new CourseRepository(CourseModel);
const moduleRepository = new ModuleRepository(ModuleModel);
const lessonRepository = new LessonRepository(LessonModel);
const walletRepository = new WalletRepository(WalletModel);
const transactionRepository = new TransactionRepository(TransactionModel);
const trainerRepository = new TrainerRepository(UserModel);
const trainerRequestRepository = new TrainerRequestRepository(
  TrainerRequestModel
);

const courseService = new CourseService(courseRepository);
const moduleService = new ModuleService(moduleRepository);
const lessonService = new LessonService(lessonRepository);
const walletService = new WalletService(
  walletRepository,
  transactionRepository
);
const trainerService = new TrainerService(
  trainerRepository,
  trainerRequestRepository
);

const courseController = new CourseController(courseService);
const moduleController = new ModuleController(moduleService);
const lessonController = new LessonController(lessonService);
const walletController = new WalletController(walletService);
const trainerController = new TrainerController(trainerService);

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
  .get(courseController.getTrainerCourse.bind(courseController))
  .patch(courseController.listUnListCourse.bind(courseController));

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
  .delete(lessonController.deleteLesson.bind(lessonController))
  .put(lessonController.updateLessonDetails.bind(lessonController))
  .patch(
    upload.single("file"),
    lessonController.updateLessonFile.bind(lessonController)
  );

router.get(
  "/students",
  trainerController.getStudentsWithEnrolledCourses.bind(trainerController)
);

router
  .route("/wallet")
  .get(walletController.getWalletInfo.bind(walletController));

export default router;
