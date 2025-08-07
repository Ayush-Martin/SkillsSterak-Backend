import { z } from "zod";
import mongoose from "mongoose";

export const addQuizValidator = (data: any) => {
  const schema = z.object({
    title: z.string(),
    description: z.string(),
    difficulty: z.enum(["beginner", "intermediate", "advance"]),
    topics: z.array(
      z
        .string()
        .refine((value) => mongoose.Types.ObjectId.isValid(value), {
          message: "Invalid ObjectId",
        })
        .transform(
          (value) => value as unknown as mongoose.Schema.Types.ObjectId
        )
    ),
  });

  return schema.parse(data);
};

export const editQuizValidator = addQuizValidator;
