import { StatusCodes } from "../constants/statusCodes";
import { ICustomError } from "../interfaces/ICustomError";

/**
 * A utility function to create a custom error and throw it.
 * @param {string} message The error message.
 * @param {number} [status=500] The HTTP status code of the error.
 * @throws {ICustomError} The error with the given message and status.
 */
const errorCreator = (
  message: string,
  status: number = StatusCodes.INTERNAL_SERVER_ERROR
): never => {
  const err: ICustomError = new Error(message) as ICustomError;
  err.status = status;
  throw err;
};

export default errorCreator;
