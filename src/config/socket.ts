import { Server as SocketServer, ServerOptions, Socket } from "socket.io";
import type { Server } from "http";
import { SocketEvents } from "../constants/socketEvents";
import envConfig from "./env";
import { socketAuthMiddleware } from "../middlewares/socketAuth.middleware";

//services
import SocketService from "../services/socket.service";
import {
  chatService,
  messageService,
  notificationService,
  streamService,
} from "../dependencyInjector";

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
  streamService,
  chatService
);

/** Set up socket.io server */
const setUpSocket = (server: Server) => {
  const io = new SocketServer(server, socketCorsConfig);
  io.use(socketAuthMiddleware);

  io.on(SocketEvents.CONNECT, async (socket) => {
    try {
      await socketService.socketConnectionHandler(socket, socket.data.userId);
    } catch (err) {
      socket.emit(SocketEvents.CONNECTION_ERROR, err);
    }
  });

  return io;
};

export default setUpSocket;
