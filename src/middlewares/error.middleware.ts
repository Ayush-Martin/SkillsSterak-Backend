import { NextFunction, Request, response, Response } from "express";
import { ICustomError } from "../interfaces/ICustomError";
import { errorResponse } from "../utils/responseCreators";
import { StatusCodes } from "../constants/statusCodes";
import { z } from "zod";

/**
 * Centralized error handler for Express routes and middleware.
 * - Logs all errors for debugging and monitoring.
 * - Handles custom errors and Zod validation errors differently for clear client feedback.
 * - Ensures consistent error response structure and status codes across the API.
 */
const errorHandler = (
  err: ICustomError | z.ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error details for diagnostics
  console.warn(`[Error] ${err.message}`);
  console.log(err);

  // Handle custom errors (not Zod validation errors)
  if (!(err instanceof z.ZodError)) {
    res
      .status(Number(err.status) || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(err.message));
    return;
  }

  // Handle Zod validation errors with detailed feedback
  const zodErrors = err.errors.map((e) => e.message).join(", ");
  res
    .status(StatusCodes.BAD_REQUEST)
    .json(errorResponse(`Validation failed: ${zodErrors}`));
};

export default errorHandler;
