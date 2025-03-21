import { Server as SocketServer, ServerOptions, Socket } from "socket.io";
import type { Server } from "http";
import { SocketEvents } from "../constants/socketEvents";
import envConfig from "./env";
import { socketAuthMiddleware } from "../middlewares/socketAuth.middleware";

//models
import NotificationModel from "../models/Notification.model";
import UserModel from "../models/User.model";
import CourseModel from "../models/Course.model";
import PremiumChatModel from "../models/PremiumChat.model";
import PremiumMessageModel from "../models/PremiumMessage.model";

//repositories
import NotificationRepository from "../repositories/notification.repository";
import UserRepository from "../repositories/user.repository";
import TrainerRepository from "../repositories/trainer.repository";
import CourseRepository from "../repositories/course.repository";
import PremiumChatRepository from "../repositories/premiumChat.repository";
import PremiumMessageRepository from "../repositories/premiumMessage.repository";

//services
import SocketService from "../services/socket.service";
import NotificationService from "../services/notification.service";
import PremiumChatService from "../services/premiumChat.service";
import { notificationService, premiumChatService } from "../dependencyInjector";

const socketCorsConfig: Partial<ServerOptions> = {
  cors: {
    origin: envConfig.FRONTEND_DOMAIN,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ["websocket", "polling"],
};



const socketService = new SocketService(
  notificationService,
  premiumChatService
);

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
