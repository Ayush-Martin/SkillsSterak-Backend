import { z } from "zod";
import mongoose from "mongoose";

export const CategoryNameValidationRule = z
  .string()
  .min(3, "category name must have at least 3 characters")
  .max(20, "category name must be within 20 characters");

export const CourseTitleValidationRule = z
  .string()
  .min(3, "course title must have minimum 3 characters")
  .max(20, "course title must be below 20 characters");

export const CoursePriceValidationRule = z.preprocess(
  (val) => Number(val),
  z.number().min(0, "price should be 0 or more")
);

// Course Skills Covered Validation
export const CourseSkillsCoveredValidationRule = z
  .string()
  .transform((val) => {
    try {
      return JSON.parse(val); // Convert the JSON string to an array
    } catch (error) {
      throw new Error("Invalid JSON string");
    }
  })
  .refine(
    (val) => Array.isArray(val) && val.every((v) => typeof v === "string"),
    {
      message: "Skills covered should be an array of strings",
    }
  );

// Course Requirements Validation
export const CourseRequirementsValidationRule = z
  .string()
  .transform((val) => {
    try {
      return JSON.parse(val); // Convert the JSON string to an array
    } catch (error) {
      throw new Error("Invalid JSON string");
    }
  })
  .refine(
    (val) => Array.isArray(val) && val.every((v) => typeof v === "string"),
    {
      message: "Requirements should be an array of strings",
    }
  );

export const CourseDifficultyValidationRule = z.enum(
  ["beginner", "intermediate", "advance"],
  { message: "invalid difficulty" }
);

export const CourseDescriptionValidationRule = z
  .string()
  .min(10, "description must have 10 or more character")
  .max(100, "description must be within 100 characters");

export const CourseCategoryIdValidationRule = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid ObjectId",
  })
  .transform((value) => value as unknown as mongoose.Schema.Types.ObjectId);

export const ModuleTitleValidationRule = z.string();

export const LessonTitleValidationRule = z.string();

export const LessonDescriptionValidationRule = z.string();

export const LessonTypeValidationRule = z.enum(["video", "pdf"]);

export const CoursePriceFilterValidationRule = z.enum(["all", "free", "paid"]);

export const CourseSortValidationRule = z.enum([
  "popularity",
  "new",
  "priceLowToHigh",
  "priceHighToLow",
  "aA-zZ",
  "zZ-aA",
]);

export const AiChatMessageValidationRule = z.string();
export const AiChatHistoryValidationRule = z.array(
  z.object({
    role: z.enum(["user", "model"]),
    parts: z.tuple([z.object({ text: z.string() })]),
  })
);
