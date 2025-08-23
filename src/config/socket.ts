import { Server as SocketServer, ServerOptions } from "socket.io";
import type { Server } from "http";
import { SocketEvents } from "../constants/socketEvents";
import envConfig from "./env";

// Middlewares
import { socketAuthMiddleware } from "../middlewares/socketAuth.middleware";

// Services
import SocketService from "../services/socket.service";
import {
  chatService,
  liveSessionService,
  notificationService,
} from "../dependencyInjector";

/**
 * Socket.io CORS and transport configuration.
 *
 * - Allows connections from the frontend domain.
 * - Enables credentials and specific headers.
 * - Supports both websocket and polling transports.
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
 * Main socket service instance.
 *
 * Handles socket event logic for notifications, chat, and live streams.
 */
const socketService = new SocketService(
  notificationService,
  chatService,
  liveSessionService
);

/**
 * Initializes and configures the Socket.io server.
 *
 * Responsibilities:
 * - Applies CORS and transport settings.
 * - Uses authentication middleware.
 * - Handles new socket connections and errors.
 *
 * @param {Server} server - HTTP server instance to attach Socket.io to.
 * @returns {SocketServer} Configured Socket.io server instance.
 */
const setUpSocket = (server: Server) => {
  const io = new SocketServer(server, socketCorsConfig);
  io.use(socketAuthMiddleware); // apply socket auth middleware

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
