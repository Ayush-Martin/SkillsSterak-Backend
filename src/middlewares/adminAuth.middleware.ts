import { NextFunction, Request, response, Response } from "express";
import { StatusCodes } from "../constants/statusCodes";
import errorCreator from "../utils/customError";

//services
import { extractTokenFromHeader, verifyToken } from "../utils/JWT";
import { authService } from "../dependencyInjector";
import { AuthMessage } from "../constants/responseMessages";

/**
 * Ensures that only authenticated admin users can access protected routes.
 * - Extracts and verifies the access token from the request header to confirm user identity.
 * - Checks if the user exists, is not blocked, and has the 'admin' role before granting access.
 * - Attaches the user ID to the request object for downstream use.
 * - Forwards errors to the error handler for consistent error responses.
 */
export const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header for authentication
    const token = extractTokenFromHeader(req.get("authorization"));

    // Reject if no token is provided
    if (!token) {
      return errorCreator(
        AuthMessage.InvalidAccessToken,
        StatusCodes.UNAUTHORIZED
      );
    }

    // Verify token and extract user ID
    const payload = await verifyToken(token);
    const jwtPayload = payload as { _id: string };

    // Fetch user data to validate existence and role
    let userData = await authService.getUserById(jwtPayload._id);

    // Reject if user does not exist
    if (!userData) {
      return;
    }

    // Block access if user is blocked
    if (userData?.isBlocked) {
      errorCreator(AuthMessage.UserBlocked, StatusCodes.FORBIDDEN);
    }

    // Block access if user is not an admin
    if (userData.role != "admin") {
      errorCreator(AuthMessage.NoAccess, StatusCodes.FORBIDDEN);
    }

    // Attach user ID to request for downstream handlers
    req.userId = userData?._id as string;
    next();
  } catch (err) {
    // Forward errors to the error handler middleware
    next(err);
  }
};
