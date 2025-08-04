import { Server as SocketServer, ServerOptions } from "socket.io";
import type { Server } from "http";
import { SocketEvents } from "../constants/socketEvents";
import envConfig from "./env";

//middlewares
import { socketAuthMiddleware } from "../middlewares/socketAuth.middleware";

//services
import SocketService from "../services/socket.service";
import {
  chatService,
  notificationService,
  streamService,
} from "../dependencyInjector";

/**
 * Socket.io CORS and transport configuration.
 * Allows connections from the frontend domain with credentials and specific headers.
 */
const socketCorsConfig: Partial<ServerOptions> = {
  cors: {
    origin: envConfig.FRONTEND_DOMAIN,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ["websocket", "polling"],
};

/**
 * Main socket service instance, handles socket event logic for notifications, streams, and chat.
 */
const socketService = new SocketService(
  notificationService,
  streamService,
  chatService
);

/**
 * Initializes and configures the Socket.io server with authentication and connection handling.
 * - Applies CORS and transport settings
 * - Uses authentication middleware
 * - Handles new socket connections and errors
 * @param server HTTP server instance
 * @returns Configured Socket.io server instance
 */
const setUpSocket = (server: Server) => {
  const io = new SocketServer(server, socketCorsConfig);
  io.use(socketAuthMiddleware); // using socket middleware

  io.on(SocketEvents.CONNECT, async (socket) => {
    try {
      console.info("[Socket] Connected to socket");
      await socketService.socketConnectionHandler(socket, socket.data.userId);
    } catch (err) {
      socket.emit(SocketEvents.CONNECTION_ERROR, err);
    }
  });

  return io;
};

export default setUpSocket;
