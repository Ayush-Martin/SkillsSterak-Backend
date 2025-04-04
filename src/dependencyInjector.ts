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
import PremiumChatModel from "./models/PremiumChat.model";
import PremiumMessageModel from "./models/PremiumMessage.model";
import StreamModel from "./models/Stream.model";

//repositories
import CategoryRepository from "./repositories/category.repository";
import CourseRepository from "./repositories/course.repository";
import EnrolledCoursesRepository from "./repositories/enrolledCourses.repository";
import LessonRepository from "./repositories/Lesson.repository";
import ModuleRepository from "./repositories/Module.repository";
import RedisRepository from "./repositories/redis.repository";
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
import PremiumChatRepository from "./repositories/premiumChat.repository";
import PremiumMessageRepository from "./repositories/premiumMessage.repository";
import StreamRepository from "./repositories/Stream.repository";

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
import PremiumChatService from "./services/premiumChat.service";
import OTPService from "./services/OTP.service";
import StreamService from "./services/stream.service";
import AiChatService from "./services/aiChat.service";

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
import ChatController from "./controllers/chat.controller";
import OTPController from "./controllers/OTP.controller";
import StreamController from "./controllers/stream.controller";

// Instantiate Repositories
const categoryRepository = new CategoryRepository(CategoryModel);
const courseRepository = new CourseRepository(CourseModel);
const enrolledCoursesRepository = new EnrolledCoursesRepository(
  EnrolledCourseModel
);
const lessonRepository = new LessonRepository(LessonModel);
const moduleRepository = new ModuleRepository(ModuleModel);
const redisRepository = new RedisRepository();
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
const premiumChatRepository = new PremiumChatRepository(PremiumChatModel);
const premiumMessageRepository = new PremiumMessageRepository(
  PremiumMessageModel
);
const streamRepository = new StreamRepository(StreamModel);

// Instantiate Services
export const otpService = new OTPService(redisRepository);
export const authService = new AuthService(
  userRepository,
  redisRepository,
  otpService
);
export const categoryService = new CategoryService(categoryRepository);
export const courseService = new CourseService(courseRepository);
export const enrolledCoursesService = new EnrolledCoursesService(
  enrolledCoursesRepository,
  courseRepository,
  walletRepository,
  transactionRepository
);
export const jwtService = new JWTService(refreshTokenRepository);
export const lessonService = new LessonService(lessonRepository);
export const moduleService = new ModuleService(moduleRepository);
export const reviewService = new ReviewService(
  reviewRepository,
  replyRepository
);
export const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  transactionRepository
);
export const trainerService = new TrainerService(
  trainerRepository,
  trainerRequestRepository
);
export const transactionService = new TransactionService(transactionRepository);
export const userService = new UserService(
  userRepository,
  trainerRequestRepository
);
export const walletService = new WalletService(
  walletRepository,
  transactionRepository
);
export const googleAuthService = new GoogleAuthService();
export const notificationService = new NotificationService(
  notificationRepository,
  userRepository,
  trainerRepository,
  courseRepository
);
export const premiumChatService = new PremiumChatService(
  premiumChatRepository,
  premiumMessageRepository,
  userRepository
);
export const streamService = new StreamService(streamRepository);
export const aiChatService = new AiChatService(
  courseRepository,
  redisRepository
);

// Instantiate Controllers
export const otpController = new OTPController(otpService);
export const authController = new AuthController(
  authService,
  jwtService,
  googleAuthService,
  otpService
);
export const categoryController = new CategoryController(categoryService);
export const courseController = new CourseController(
  courseService,
  notificationService,
  aiChatService
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
  trainerService,
  notificationService
);
export const transactionController = new TransactionController(
  transactionService
);
export const userController = new UserController(
  userService,
  notificationService
);
export const walletController = new WalletController(walletService);
export const chatController = new ChatController(premiumChatService);
export const streamController = new StreamController(streamService);
