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
  console.log(err);
  if (!(err instanceof z.ZodError)) {
    res
      .status(Number(err.status) || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(err.message));
    return;
  }

  //If validation layer error or zod error
  const zodErrors = err.errors.map((e) => e.message).join(", ");
  res
    .status(StatusCodes.BAD_REQUEST)
    .json(errorResponse(`Validation failed: ${zodErrors}`));
};

export default errorHandler;
