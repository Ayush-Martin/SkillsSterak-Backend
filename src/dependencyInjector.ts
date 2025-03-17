//models
import CategoryModel from "./models/Category.model";
import CourseModel from "./models/Course.model";
import EnrolledCourseModel from "./models/EnrolledCourse.model";
import LessonModel from "./models/Lesson.model";
import ModuleModel from "./models/Module.model";
import RefreshTokenModel from "./models/RefreshToken.model";
import ReplyModel from "./models/Reply.model";
import ReviewModel from "./models/Review.model";
import SubscriptionModel from "./models/Subscription.model";
import TrainerRequestModel from "./models/TrainerRequest.model";
import TransactionModel from "./models/Transaction.model";
import UserModel from "./models/User.model";
import WalletModel from "./models/Wallet.model";
import NotificationModel from "./models/Notification.model";

//repositories
import CategoryRepository from "./repositories/category.repository";
import CourseRepository from "./repositories/course.repository";
import EnrolledCoursesRepository from "./repositories/enrolledCourses.repository";
import LessonRepository from "./repositories/Lesson.repository";
import ModuleRepository from "./repositories/Module.repository";
import OTPRepository from "./repositories/OTP.repository";
import RefreshTokenRepository from "./repositories/RefreshToken.repository";
import ReplyRepository from "./repositories/reply.repository";
import ReviewRepository from "./repositories/review.repository";
import SubscriptionRepository from "./repositories/subscription.repository";
import TrainerRepository from "./repositories/trainer.repository";
import TrainerRequestRepository from "./repositories/trainerRequest.repository";
import TransactionRepository from "./repositories/transaction.repository";
import UserRepository from "./repositories/user.repository";
import WalletRepository from "./repositories/wallet.repository";
import NotificationRepository from "./repositories/notification.repository";

//services
import AuthService from "./services/auth.service";
import CategoryService from "./services/category.service";
import CourseService from "./services/course.service";
import EnrolledCoursesService from "./services/enrolledCourses.service";
import JWTService from "./services/jwt.service";
import LessonService from "./services/lesson.service";
import ModuleService from "./services/module.service";
import ReviewService from "./services/review.service";
import SubscriptionService from "./services/subscription.service";
import TrainerService from "./services/trainer.service";
import TransactionService from "./services/transaction.service";
import UserService from "./services/user.service";
import WalletService from "./services/wallet.service";
import GoogleAuthService from "./services/googleAuth.service";
import NotificationService from "./services/notification.service";

//controllers
import AuthController from "./controllers/auth.controller";
import CategoryController from "./controllers/category.controller";
import CourseController from "./controllers/course.controller";
import EnrolledCoursesController from "./controllers/enrolledCourse.controller";
import LessonController from "./controllers/lesson.controller";
import ModuleController from "./controllers/module.controller";
import ReviewController from "./controllers/review.controller";
import SubscriptionController from "./controllers/subscription.controller";
import TrainerController from "./controllers/trainer.controller";
import TrainerRequestController from "./controllers/trainerRequest.controller";
import TransactionController from "./controllers/transaction.controller";
import UserController from "./controllers/user.controller";
import WalletController from "./controllers/wallet.controller";

// Instantiate Repositories
const categoryRepository = new CategoryRepository(CategoryModel);
const courseRepository = new CourseRepository(CourseModel);
const enrolledCoursesRepository = new EnrolledCoursesRepository(
  EnrolledCourseModel
);
const lessonRepository = new LessonRepository(LessonModel);
const moduleRepository = new ModuleRepository(ModuleModel);
const otpRepository = new OTPRepository();
const refreshTokenRepository = new RefreshTokenRepository(RefreshTokenModel);
const replyRepository = new ReplyRepository(ReplyModel);
const reviewRepository = new ReviewRepository(ReviewModel);
const subscriptionRepository = new SubscriptionRepository(SubscriptionModel);
const trainerRepository = new TrainerRepository(UserModel);
const trainerRequestRepository = new TrainerRequestRepository(
  TrainerRequestModel
);
const transactionRepository = new TransactionRepository(TransactionModel);
const userRepository = new UserRepository(UserModel);
const walletRepository = new WalletRepository(WalletModel);
const notificationRepository = new NotificationRepository(NotificationModel);

// Instantiate Services
const authService = new AuthService(userRepository, otpRepository);
const categoryService = new CategoryService(categoryRepository);
const courseService = new CourseService(courseRepository);
const enrolledCoursesService = new EnrolledCoursesService(
  enrolledCoursesRepository,
  courseRepository,
  walletRepository,
  transactionRepository
);
const jwtService = new JWTService(refreshTokenRepository);
const lessonService = new LessonService(lessonRepository);
const moduleService = new ModuleService(moduleRepository);
const reviewService = new ReviewService(reviewRepository, replyRepository);
const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  transactionRepository
);
const trainerService = new TrainerService(
  trainerRepository,
  trainerRequestRepository
);
const transactionService = new TransactionService(transactionRepository);
const userService = new UserService(userRepository, trainerRequestRepository);
const walletService = new WalletService(
  walletRepository,
  transactionRepository
);
const googleAuthService = new GoogleAuthService();
const notificationService = new NotificationService(
  notificationRepository,
  userRepository,
  trainerRepository
);

// Instantiate Controllers
export const authController = new AuthController(
  authService,
  jwtService,
  googleAuthService
);
export const categoryController = new CategoryController(categoryService);
export const courseController = new CourseController(
  courseService,
  notificationService
);
export const enrolledCourseController = new EnrolledCoursesController(
  enrolledCoursesService
);
export const lessonController = new LessonController(lessonService);
export const moduleController = new ModuleController(moduleService);
export const reviewController = new ReviewController(reviewService);
export const subscriptionController = new SubscriptionController(
  subscriptionService
);
export const trainerController = new TrainerController(trainerService);
export const trainerRequestController = new TrainerRequestController(
  trainerService
);
export const transactionController = new TransactionController(
  transactionService
);
export const userController = new UserController(userService);
export const walletController = new WalletController(walletService);
