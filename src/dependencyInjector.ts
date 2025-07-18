/**
 * Central dependency injection and wiring for all models, repositories, services, and controllers.
 * - Ensures a single source of truth for instantiating and sharing dependencies across the application.
 * - Promotes modularity, testability, and maintainability by decoupling implementation details.
 * - Used as the main entry point for accessing business logic and data access layers throughout the backend.
 */

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
import StreamModel from "./models/Stream.model";
import ChatModel from "./models/Chat.model";
import NoteBookModel from "./models/Notebook.model";
import WishlistModel from "./models/Wishlist.model";

//repositories
import CategoryRepository from "./repositories/category.repository";
import CourseRepository from "./repositories/course.repository";
import EnrolledCoursesRepository from "./repositories/enrolledCourses.repository";
import LessonRepository from "./repositories/Lesson.repository";
import ModuleRepository from "./repositories/Module.repository";
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
import StreamRepository from "./repositories/Stream.repository";
import OTPRepository from "./repositories/otp.repository";
import AiChatRepository from "./repositories/aiChat.repository";
import ChatRepository from "./repositories/chat.repository";
import MessageRepository from "./repositories/message.repository";
import NotebookRepository from "./repositories/Notebook.repository";
import WishlistRepository from "./repositories/wishlist.repository";

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
import OTPService from "./services/OTP.service";
import StreamService from "./services/stream.service";
import AiChatService from "./services/aiChat.service";
import ChatService from "./services/chat.service";
import NotebookService from "./services/notebook.service";
import WishlistService from "./services/wishlist.service";

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
import OTPController from "./controllers/OTP.controller";
import StreamController from "./controllers/stream.controller";
import ChatController from "./controllers/chat.controller";
import NotebookController from "./controllers/notebook.controller";
import WebHookController from "./controllers/webhook.controller";
import WishlistController from "./controllers/wishlist.controller";

import MessageModel from "./models/Message.model";
// Instantiate Repositories
const categoryRepository = new CategoryRepository(CategoryModel);
const courseRepository = new CourseRepository(CourseModel);
const enrolledCoursesRepository = new EnrolledCoursesRepository(
  EnrolledCourseModel
);
const lessonRepository = new LessonRepository(LessonModel);
const moduleRepository = new ModuleRepository(ModuleModel);
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
const streamRepository = new StreamRepository(StreamModel);
const otpRepository = new OTPRepository();
const aiChatRepository = new AiChatRepository();
const chatRepository = new ChatRepository(ChatModel);
const messageRepository = new MessageRepository(MessageModel);
const noteBookRepository = new NotebookRepository(NoteBookModel);
const wishlistRepository = new WishlistRepository(WishlistModel);

// Instantiate Services
export const otpService = new OTPService(otpRepository);
export const authService = new AuthService(userRepository, otpService);
export const categoryService = new CategoryService(categoryRepository);
export const courseService = new CourseService(courseRepository);
export const enrolledCoursesService = new EnrolledCoursesService(
  enrolledCoursesRepository,
  courseRepository,
  walletRepository,
  transactionRepository,
  chatRepository,
  userRepository
);
export const jwtService = new JWTService(refreshTokenRepository);
export const lessonService = new LessonService(lessonRepository);
export const moduleService = new ModuleService(moduleRepository);
export const reviewService = new ReviewService(
  reviewRepository,
  replyRepository,
  enrolledCoursesRepository
);
export const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  transactionRepository,
  userRepository
);
export const trainerService = new TrainerService(
  trainerRepository,
  trainerRequestRepository
);
export const transactionService = new TransactionService(
  transactionRepository,
  walletRepository
);
export const userService = new UserService(
  userRepository,
  trainerRequestRepository
);
export const walletService = new WalletService(
  walletRepository,
  transactionRepository,
  userRepository
);
export const googleAuthService = new GoogleAuthService();
export const notificationService = new NotificationService(
  notificationRepository,
  userRepository,
  trainerRepository,
  courseRepository
);
export const streamService = new StreamService(
  streamRepository,
  userRepository
);
export const aiChatService = new AiChatService(
  courseRepository,
  aiChatRepository
);
export const chatService = new ChatService(
  chatRepository,
  messageRepository,
  userRepository
);
export const notebookService = new NotebookService(noteBookRepository);
export const wishlistService = new WishlistService(wishlistRepository);

// Instantiate Controllers
export const otpController = new OTPController(otpService);
export const authController = new AuthController(
  authService,
  jwtService,
  googleAuthService
);
export const categoryController = new CategoryController(categoryService);
export const courseController = new CourseController(
  courseService,
  notificationService,
  aiChatService,
  chatService
);
export const enrolledCourseController = new EnrolledCoursesController(
  enrolledCoursesService,
  chatService
);
export const lessonController = new LessonController(lessonService);
export const moduleController = new ModuleController(moduleService);
export const reviewController = new ReviewController(reviewService);
export const subscriptionController = new SubscriptionController(
  subscriptionService
);
export const trainerController = new TrainerController(
  trainerService,
  userService
);
export const trainerRequestController = new TrainerRequestController(
  trainerService,
  notificationService
);
export const transactionController = new TransactionController(
  transactionService,
  enrolledCoursesService
);
export const userController = new UserController(
  userService,
  notificationService
);
export const walletController = new WalletController(walletService);
export const streamController = new StreamController(streamService);
export const chatController = new ChatController(chatService);
export const notebookController = new NotebookController(notebookService);
export const webhookController = new WebHookController(
  streamService,
  enrolledCoursesService,
  chatService,
  subscriptionService,
  wishlistService
);
export const wishlistController = new WishlistController(wishlistService);
