import { Router } from "express";

const router = Router();

//models
import UserModel from "../models/User.model";
import TrainerRequestModel from "../models/TrainerRequest.model";
import EnrollCourseModel from "../models/EnrolledCourse.model";
import CourseModel from "../models/Course.model";
import CategoryModel from "../models/Category.model";
import LessonModel from "../models/Lesson.model";
import WalletModel from "../models/Wallet.model";
import TransactionModel from "../models/Transaction.model";
<<<<<<< HEAD
=======
import SubscriptionModel from "../models/Subscription.model";
>>>>>>> main

//repositories
import UserRepository from "../repositories/user.repository";
import TrainerRequestRepository from "../repositories/trainerRequest.repository";
import EnrolledCoursesRepository from "../repositories/enrolledCourses.repository";
import CourseRepository from "../repositories/course.repository";
import CategoryRepository from "../repositories/category.repository";
import LessonRepository from "../repositories/Lesson.repository";
import WalletRepository from "../repositories/wallet.repository";
import TransactionRepository from "../repositories/transaction.repository";
<<<<<<< HEAD
=======
import SubscriptionRepository from "../repositories/subscription.repository";
>>>>>>> main

//services
import UserService from "../services/user.service";
import EnrolledCoursesService from "../services/enrolledCourses.service";
import CourseService from "../services/course.service";
import CategoryService from "../services/category.service";
import LessonService from "../services/lesson.service";
import TransactionService from "../services/transaction.service";
<<<<<<< HEAD
=======
import SubscriptionService from "../services/subscription.service";
>>>>>>> main

//controllers
import UserController from "../controllers/user.controller";
import EnrolledCourses from "../controllers/enrolledCourse.controller";
import CourseController from "../controllers/course.controller";
import CategoryController from "../controllers/category.controller";
import LessonController from "../controllers/lesson.controller";
import TransactionController from "../controllers/transaction.controller";
<<<<<<< HEAD
=======
import SubscriptionController from "../controllers/subscription.controller";
>>>>>>> main

//middlewares
import multerUpload from "../config/multer";
import { accessTokenValidator } from "../middlewares/userAuth.middleware";
<<<<<<< HEAD
=======
import { subscriptionValidator } from "../middlewares/subscriptionValidator.middleware";
>>>>>>> main

//repositories
const userRepository = new UserRepository(UserModel);
const trainerRequestRepository = new TrainerRequestRepository(
  TrainerRequestModel
);
const enrolledCoursesRepository = new EnrolledCoursesRepository(
  EnrollCourseModel
);
const courseRepository = new CourseRepository(CourseModel);
const categoryRepository = new CategoryRepository(CategoryModel);
const lessonRepository = new LessonRepository(LessonModel);
const walletRepository = new WalletRepository(WalletModel);
const transactionRepository = new TransactionRepository(TransactionModel);
<<<<<<< HEAD
=======
const subscriptionRepository = new SubscriptionRepository(SubscriptionModel);
>>>>>>> main

//services
const userService = new UserService(userRepository, trainerRequestRepository);
const enrolledCoursesService = new EnrolledCoursesService(
  enrolledCoursesRepository,
  courseRepository,
  walletRepository,
  transactionRepository
);
const courseService = new CourseService(courseRepository);
const categoryService = new CategoryService(categoryRepository);
const lessonService = new LessonService(lessonRepository);
const transactionService = new TransactionService(transactionRepository);
<<<<<<< HEAD
=======
const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  transactionRepository
);
>>>>>>> main

//controllers
const userController = new UserController(userService);
const enrolledCourseController = new EnrolledCourses(enrolledCoursesService);
const courseController = new CourseController(courseService);
const categoryController = new CategoryController(categoryService);
const lessonController = new LessonController(lessonService);
const transactionController = new TransactionController(transactionService);
<<<<<<< HEAD
=======
const subscriptionController = new SubscriptionController(subscriptionService);
>>>>>>> main

router.get("/courses", courseController.getCourses.bind(courseController));
router.get(
  "/categories",
  categoryController.getAllCategories.bind(categoryController)
);

router
  .route("/courses/:courseId")
  .get(courseController.getCourse.bind(courseController))
  .post(
    accessTokenValidator,
    enrolledCourseController.enrollCourse.bind(enrolledCourseController)
  );

//setting middleware
router.use(accessTokenValidator);

router.post(
  "/courses/:courseId/payment",
  enrolledCourseController.completePurchase.bind(enrolledCourseController)
);

router.get(
  "/courses/:courseId/access",
  enrolledCourseController.checkEnrolled.bind(enrolledCourseController)
);

router.get(
  "/enrolledCourses",
  enrolledCourseController.getEnrolledCourses.bind(enrolledCourseController)
);

router.get(
  "/enrolledCourses/:courseId",
  enrolledCourseController.getEnrolledCourse.bind(enrolledCourseController)
);

router
  .route("/enrolledCourses/:courseId/lessons/:lessonId")
  .get(lessonController.getLesson.bind(lessonController))
  .patch(
    enrolledCourseController.completeUnCompleteLesson.bind(
      enrolledCourseController
    )
  );

router
  .route("/profile")
  .patch(
    multerUpload.single("image"),
    userController.changeProfileImage.bind(userController)
  )
  .put(userController.updateProfile.bind(userController));

router.get(
  "/transactions",
  transactionController.getUserTransactions.bind(transactionController)
);

router.get(
  "/trainerRequest",
  userController.sendTrainerRequest.bind(userController)
);

router
  .route("/subscription")
  .get(
    subscriptionController.createSubscriptionOrder.bind(subscriptionController)
  )
  .post(
    subscriptionController.completeSubscription.bind(subscriptionController)
  );

router.get("/chat", subscriptionValidator, (req, res) => {
  res.status(200).json({ message: "success" });
});
export default router;
