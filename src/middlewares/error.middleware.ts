import { NextFunction, Request, response, Response } from "express";
import { ICustomError } from "../interfaces/ICustomError";
import { errorResponse } from "../utils/responseCreators";
import { StatusCodes } from "../utils/statusCodes";
import { z } from "zod";

const errorHandler = (
  err: ICustomError | z.ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status: number;
  let error: string;

  if (err instanceof z.ZodError) {
    status = StatusCodes.BAD_REQUEST;
    error = `Validation failed ${JSON.stringify(err.errors)}`;
  } else {
    status = Number(err.status) || StatusCodes.INTERNAL_SERVER_ERROR;
    error = err.message || "An unexpected error occurred";
  }

  res.status(status).json(errorResponse(error));
};

export default errorHandler;
