import { Server as SocketServer, ServerOptions, Socket } from "socket.io";
import type { Server } from "http";
import { SocketEvents } from "../constants/socketEvents";
import envConfig from "./env";
import { socketAuthMiddleware } from "../middlewares/socketAuth.middleware";

//models
import NotificationModel from "../models/Notification.model";
import UserModel from "../models/User.model";
import CourseModel from "../models/Course.model";

//repositories
import NotificationRepository from "../repositories/notification.repository";
import UserRepository from "../repositories/user.repository";
import TrainerRepository from "../repositories/trainer.repository";
import CourseRepository from "../repositories/course.repository";

//services
import SocketService from "../services/socket.service";
import NotificationService from "../services/notification.service";

const socketCorsConfig: Partial<ServerOptions> = {
  cors: {
    origin: envConfig.FRONTEND_DOMAIN,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ["websocket", "polling"],
};

//repositories
const notificationRepository = new NotificationRepository(NotificationModel);
const userRepository = new UserRepository(UserModel);
const trainerRepository = new TrainerRepository(UserModel);
const courseRepository = new CourseRepository(CourseModel);

//services
const notificationService = new NotificationService(
  notificationRepository,
  userRepository,
  trainerRepository,
  courseRepository
);
const socketService = new SocketService(notificationService);

const setUpSocket = (server: Server) => {
  const io = new SocketServer(server, socketCorsConfig);
  io.use(socketAuthMiddleware);

  io.on(SocketEvents.CONNECT, async (socket) => {
    try {
      await socketService.socketConnectionHandler(socket, socket.data.userId);
    } catch (err) {
      socket.emit("error", err);
    }
  });

  return io;
};

export default setUpSocket;
