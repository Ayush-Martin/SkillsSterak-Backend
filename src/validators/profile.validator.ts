import { z } from "zod";
import { IUser } from "../models/User.model";

export const updateProfileValidator = (user: Partial<IUser>) => {
  const schema = z.object({
    username: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long." }),
    about: z
      .string()
      .min(10, { message: "About must be at least 10 char long" })
      .max(20, { message: "About must be at most 20 char long" }),
  });

  return schema.parse(user);
};
