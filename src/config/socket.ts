import { Server as SocketServer, ServerOptions, Socket } from "socket.io";
import type { Server } from "http";
import { SocketEvents } from "../constants/socketEvents";
import envConfig from "./env";
import { socketAuthMiddleware } from "../middlewares/socketAuth.middleware";
import SocketService from "../services/socket.service";
import NotificationModel from "../models/Notification.model";
import NotificationRepository from "../repositories/notification.repository";

const socketCorsConfig: Partial<ServerOptions> = {
  cors: {
    origin: envConfig.FRONTEND_DOMAIN,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ["websocket", "polling"],
};

const notificationRepository = new NotificationRepository(NotificationModel);
const socketService = new SocketService(notificationRepository);

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
