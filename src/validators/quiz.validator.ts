import { z } from "zod";
import mongoose, { ObjectId } from "mongoose";
import {
  PageRecordSizeValidationRule,
  PageValidationRule,
  SearchValidationRule,
} from "./rules/pagination.validationRule";

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

export const getUserQuizzesValidator = (data: any) => {
  const schema = z.object({
    page: PageValidationRule,
    size: PageRecordSizeValidationRule,
    search: SearchValidationRule,
    difficulty: z.enum(["all", "beginner", "intermediate", "advance"]),
    topics: z
      .string()
      .refine(
        (val) =>
          val === "all" || val.split(",").every((t) => t.trim().length > 0),
        {
          message:
            "Topics must be 'all' or a comma-separated list of non-empty strings",
        }
      )
      .transform((val) => {
        if (val === "all") return "all";
        return val
          .split(",")
          .map(
            (t) => new mongoose.Types.ObjectId(t.trim()) as unknown as ObjectId
          );
      }),
  });

  return schema.parse(data);
};
