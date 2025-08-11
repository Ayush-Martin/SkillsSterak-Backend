import mongoose, { ObjectId } from "mongoose";
import { z } from "zod";

export const submitQuizValidator = (data: any) => {
  const schema = z.object({
    timeTaken: z.number(),
    answers: z.array(
      z.object({
        questionId: z
          .string()
          .transform(
            (val) => new mongoose.Types.ObjectId(val) as unknown as ObjectId
          ),
        answer: z.string(),
      })
    ),
  });

  return schema.parse(data);
};

export const resubmitQuizValidator = submitQuizValidator;
