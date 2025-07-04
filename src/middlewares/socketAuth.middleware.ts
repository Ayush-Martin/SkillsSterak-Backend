import { Socket } from "socket.io";

import { StatusCodes } from "../constants/statusCodes";
import errorCreator from "../utils/customError";
import { verifyToken } from "../utils/JWT";
import { authService } from "../dependencyInjector";
import { AuthMessage } from "../constants/responseMessages";

/**
 * Authenticates socket connections using JWT tokens for real-time features.
 * - Extracts and verifies the token from the socket handshake to confirm user identity.
 * - Ensures the user exists and is not blocked before allowing the connection.
 * - Attaches the user ID to the socket data for downstream event handlers.
 * - Forwards errors to the next handler for consistent error handling in the socket pipeline.
 */
export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    // Extract token from socket handshake for authentication
    const token = socket.handshake.auth?.token as string;
    const payload = await verifyToken(token);
    const jwtPayload = payload as {
      _id: string;
    };

    // Reject if token does not contain a user ID
    if (!jwtPayload._id) {
      next(
        errorCreator(AuthMessage.InvalidAccessToken, StatusCodes.UNAUTHORIZED)
      );
    }

    // Fetch user data to validate existence and status
    const userData = await authService.getUserById(jwtPayload._id);

    // Reject if user does not exist
    if (!userData) {
      return next(
        errorCreator(AuthMessage.InvalidAccessToken, StatusCodes.UNAUTHORIZED)
      );
    }

    // Block access if user is blocked
    if (userData.isBlocked) {
      return next(errorCreator(AuthMessage.UserBlocked, StatusCodes.FORBIDDEN));
    }

    // Attach user ID to socket data for use in event handlers
    socket.data = { userId: jwtPayload._id };
    next();
  } catch (err) {
    // Forward errors to the next handler for consistent error handling
    const error =
      err instanceof Error ? err : new Error("Authentication error");
    next(error);
  }
};
