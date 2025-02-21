import { z } from "zod";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";
import { IUser } from "../models/User.model";

export const updateProfileValidator = (user: Partial<IUser>) => {
  const { username, about } = user;
  if (!username || !about) {
    return errorCreator(
      "Please provide all the required fields",
      StatusCodes.BAD_REQUEST
    );
  }

  const schema = z.object({
    username: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long." }),
    about: z
      .string()
      .min(10, { message: "About must be at least 10 char long" })
      .max(20, { message: "About must be at most 20 char long" }),
  });

  return schema.parse({ username, about });
};
