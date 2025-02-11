import { StatusCodes } from "./statusCodes";
import { ICustomError } from "../interfaces/ICustomError";

const errorCreator = (
  message: string,
  status: number = StatusCodes.INTERNAL_SERVER_ERROR
): never => {
  const err: ICustomError = new Error(message) as ICustomError;
  err.status = status;
  throw err;
};

export default errorCreator;
