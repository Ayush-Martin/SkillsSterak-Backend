import { Socket } from "socket.io";
import {
  BLOCKED_ERROR_MESSAGE,
  INVALID_ACCESS_TOKEN_ERROR_MESSAGE,
} from "../constants/responseMessages";
import { StatusCodes } from "../constants/statusCodes";
import errorCreator from "../utils/customError";
import { verifyToken } from "../utils/JWT";
import { authService } from "../dependencyInjector";

export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const token = socket.handshake.auth?.token as string;
    const payload = await verifyToken(token);
    const jwtPayload = payload as {
      _id: string;
    };

    if (!jwtPayload._id) {
      next(
        errorCreator(
          INVALID_ACCESS_TOKEN_ERROR_MESSAGE,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    const userData = await authService.getUserById(jwtPayload._id);

    if (!userData) {
      return next(
        errorCreator(
          INVALID_ACCESS_TOKEN_ERROR_MESSAGE,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    if (userData.isBlocked) {
      return next(errorCreator(BLOCKED_ERROR_MESSAGE, StatusCodes.FORBIDDEN));
    }

    socket.data = { userId: jwtPayload._id };
    next();
  } catch (err) {
    const error =
      err instanceof Error ? err : new Error("Authentication error");
    next(error);
  }
};
