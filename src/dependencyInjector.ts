/**
 * Central dependency injection and wiring for all models, repositories, services, and controllers.
 * - Ensures a single source of truth for instantiating and sharing dependencies across the application.
 * - Promotes modularity, testability, and maintainability by decoupling implementation details.
 * - Used as the main entry point for accessing business logic and data access layers throughout the backend.
 */

//models
import MessageModel from "./models/Message.model";
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
import AssignmentModel from "./models/Assignment.model";
import LiveSessionModel from "./models/LiveSession.model";
import DiscussionModel from "./models/Discussion.model";
import AssignmentSubmissionModel from "./models/AssignmentSubmission.model";
import SubscriptionPlanModel from "./models/SubscriptionPlan.model";
import TopicModel from "./models/Topic.model";
import QuizModel from "./models/Quiz.model";
import QuestionModel from "./models/Question.model";

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
import AssignmentRepository from "./repositories/assignment.repository";
import LiveSessionRepository from "./repositories/liveSession.repository";
import DiscussionRepository from "./repositories/discussion.repository";
import AssignmentSubmissionRepository from "./repositories/assignmentSubmission.repository";
import SubscriptionPlanRepository from "./repositories/subscriptionPlan.repository";
import TopicRepository from "./repositories/topic.repository";
import QuizRepository from "./repositories/quiz.repository";
import QuestionRepository from "./repositories/question.repository";

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
import AssignmentService from "./services/assignment.service";
import LiveSessionService from "./services/liveSession.service";
import DiscussionService from "./services/discussion.service";
import AssignmentSubmissionService from "./services/assignmentSubmission.service";
import SubscriptionPlanService from "./services/subscriptionPlan.service";
import TopicService from "./services/topic.service";
import QuizService from "./services/quiz.service";
import QuestionService from "./services/question.service";

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
import AssignmentController from "./controllers/assignment.controller";
import LiveSessionController from "./controllers/liveSession.controller";
import DiscussionController from "./controllers/discussion.controller";
import AssignmentSubmissionController from "./controllers/assignmentSubmission.controller";
import SubscriptionPlanController from "./controllers/subscriptionPlan.controller";
import TopicController from "./controllers/topic.controller";
import QuizController from "./controllers/quiz.controller";
import QuestionController from "./controllers/question.controller";

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
const assignmentRepository = new AssignmentRepository(AssignmentModel);
const liveSessionRepository = new LiveSessionRepository(LiveSessionModel);
const discussionRepository = new DiscussionRepository(DiscussionModel);
const assignmentSubmissionRepository = new AssignmentSubmissionRepository(
  AssignmentSubmissionModel
);
const subscriptionPlanRepository = new SubscriptionPlanRepository(
  SubscriptionPlanModel
);
const topicRepository = new TopicRepository(TopicModel);
const quizRepository = new QuizRepository(QuizModel);
const questionRepository = new QuestionRepository(QuestionModel);

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
  userRepository,
  lessonRepository
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
  userRepository,
  subscriptionPlanRepository
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
export const assignmentService = new AssignmentService(assignmentRepository);
export const liveSessionService = new LiveSessionService(
  liveSessionRepository,
  courseRepository
);
export const discussionService = new DiscussionService(
  discussionRepository,
  replyRepository
);
export const assignmentSubmissionService = new AssignmentSubmissionService(
  assignmentSubmissionRepository
);
export const subscriptionPlanService = new SubscriptionPlanService(
  subscriptionPlanRepository
);
export const topicService = new TopicService(topicRepository);
export const quizService = new QuizService(quizRepository);
export const questionService = new QuestionService(questionRepository);

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
  wishlistService,
  liveSessionService
);
export const wishlistController = new WishlistController(wishlistService);
export const assignmentController = new AssignmentController(assignmentService);
export const liveSessionController = new LiveSessionController(
  liveSessionService
);
export const discussionController = new DiscussionController(discussionService);
export const assignmentSubmissionController =
  new AssignmentSubmissionController(assignmentSubmissionService);
export const subscriptionPlanController = new SubscriptionPlanController(
  subscriptionPlanService
);
export const topicController = new TopicController(topicService);
export const quizController = new QuizController(quizService);
export const questionController = new QuestionController(questionService);
