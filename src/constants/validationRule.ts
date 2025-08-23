import mongoose, { ObjectId } from "mongoose";
import { z } from "zod";
import { SUBSCRIPTION_FEATURE_IDS, ISubscriptionFeatureId } from "./general";

const getMinLengthMessage = (field: string, val: number) => {
  return `${field} must be at least ${val} characters long`;
};

const getMaxLengthMessage = (field: string, val: number) => {
  return `${field} must be ${val} characters or less`;
};

const getValidUrlMessage = (field: string) => {
  return `${field} must be a valid URL`;
};

const getAtLeastMessage = (field: string, val: number, type: string) => {
  return `${field} must contain at least ${val} ${type}`;
};

const getMinValueMessage = (field: string, val: number) => {
  return `${field} must be at least ${val}`;
};

const getMaxValueMessage = (field: string, val: number) => {
  return `${field} must be ${val} or less`;
};

const getArrayValidation = (field: string, type: "string" | "number") => {
  return z
    .string()
    .transform((val) => {
      try {
        return JSON.parse(val);
      } catch (error) {
        throw new Error("Invalid JSON string");
      }
    })
    .refine(
      (val) => Array.isArray(val) && val.every((v) => typeof v === type),
      {
        message: `${field} should be an array of ${type}s`,
      }
    );
};

const ObjectIDValidation = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid ObjectId",
  })
  .transform((value) => value as unknown as mongoose.Schema.Types.ObjectId);

export const PaginationValidationRule = {
  search: z.string().default(""),
  page: z
    .string()
    .transform((val) => parseInt(val))
    .default("1"),
  size: z
    .string()
    .transform((val) => parseInt(val))
    .default("5"),
} as const;

export const OTPValidationRule = {
  OTP: z.string().length(6, "OTP must be 6 digits long"),
} as const;

export const UserValidationRule = {
  Email: z.string().email("Invalid email"),
  Password: z
    .string()
    .min(8, getMinLengthMessage("Password", 8))
    .max(100, getMaxLengthMessage("Password", 100))
    .regex(/[a-z]/, {
      message: getAtLeastMessage("Password", 1, "lowercase letter"),
    })
    .regex(/[A-Z]/, getAtLeastMessage("Password", 1, "uppercase letter"))
    .regex(/\d/, getAtLeastMessage("Password", 1, "number"))
    .regex(/[\W_]/, getAtLeastMessage("Password", 1, "special character")),
  Username: z
    .string()
    .min(3, getMinLengthMessage("Username", 3))
    .max(20, getMaxLengthMessage("Username", 20))
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  Bio: z.string().max(2000, getMaxLengthMessage("Bio", 2000)),
  Location: z
    .string()
    .min(2, getMinLengthMessage("Location", 2))
    .max(100, getMaxLengthMessage("Location", 100)),
  Position: z
    .string()
    .min(2, getMinLengthMessage("Position", 2))
    .max(100, getMaxLengthMessage("Position", 100)),
  Company: z
    .string()
    .min(2, getMinLengthMessage("Company", 2))
    .max(100, getMaxLengthMessage("Company", 100)),
  Education: z
    .string()
    .min(2, getMinLengthMessage("Education", 2))
    .max(200, getMaxLengthMessage("Education", 200)),
  Skills: z.array(
    z
      .string()
      .min(2, getMinLengthMessage("Skill", 2))
      .max(100, getMaxLengthMessage("Skill", 100))
  ),
  Experience: z.array(
    z.object({
      id: z.string(),
      company: z
        .string()
        .min(2, getMinLengthMessage("Company", 2))
        .max(100, getMaxLengthMessage("Company", 100)),
      position: z
        .string()
        .min(2, getMinLengthMessage("Position", 2))
        .max(100, getMaxLengthMessage("Position", 100)),
      duration: z
        .string()
        .min(2, getMinLengthMessage("Duration", 2))
        .max(100, getMaxLengthMessage("Duration", 100)),
      description: z.string().min(2).max(1000),
    })
  ),
  SocialLinks: z.object({
    github: z
      .string()
      .url({ message: getValidUrlMessage("GitHub") })
      .optional(),
    linkedin: z
      .string()
      .url({ message: getValidUrlMessage("LinkedIn") })
      .optional(),
    website: z
      .string()
      .url({ message: getValidUrlMessage("website") })
      .optional(),
    instagram: z
      .string()
      .url({ message: getValidUrlMessage("Instagram") })
      .optional(),
    facebook: z
      .string()
      .url({ message: getValidUrlMessage("Facebook") })
      .optional(),
    youtube: z
      .string()
      .url({ message: getValidUrlMessage("YouTube") })
      .optional(),
  }),
} as const;

export const AssignmentValidationRule = {
  Title: z
    .string()
    .min(2, getMinLengthMessage("Title", 2))
    .max(100, getMaxLengthMessage("Title", 100)),
  Description: z
    .string()
    .min(2, getMinLengthMessage("Description", 2))
    .max(1000, getMaxLengthMessage("Description", 1000)),
  Task: z
    .string()
    .min(10, getMinLengthMessage("Task", 10))
    .max(10000, getMaxLengthMessage("Task", 10000)),
} as const;

export const AssignmentSubmissionValidationRule = {
  type: z.enum(["text", "image", "pdf"]),
  content: z
    .string()
    .min(10, getMinLengthMessage("Content", 10))
    .max(10000, getMaxLengthMessage("Content", 10000)),
  status: z.enum(["verified", "redo"]),
} as const;

export const CategoryValidationRule = {
  categoryName: z
    .string()
    .min(2, getMinLengthMessage("categoryName", 2))
    .max(100, getMaxLengthMessage("categoryName", 100)),
};

export const CourseValidationRule = {
  title: z
    .string()
    .min(5, getMinLengthMessage("title", 5))
    .max(100, getMaxLengthMessage("title", 100)),
  description: z
    .string()
    .min(10, getMinLengthMessage("description", 10))
    .max(2000, getMaxLengthMessage("description", 2000)),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, getMinValueMessage("price", 0))
  ),
  skillsCovered: getArrayValidation("Skills covered", "string"),
  requirements: getArrayValidation("Requirements", "string"),
  difficulty: z.enum(["beginner", "intermediate", "advance"]),
  categoryId: ObjectIDValidation,
  status: z.enum(["approved", "rejected"]),
} as const;

export const CourseFilterSortValidationRule = {
  price: z.enum(["all", "free", "paid"]),
  sort: z.enum([
    "popularity",
    "new",
    "priceLowToHigh",
    "priceHighToLow",
    "aA-zZ",
    "zZ-aA",
  ]),
  category: z.string(),
  difficulty: CourseValidationRule.difficulty.or(z.enum(["all"])),
} as const;

export const AiChatValidationRule = {
  message: z
    .string()
    .min(1, getMinLengthMessage("message", 1))
    .max(1000, getMaxLengthMessage("message", 1000)),
  history: z.array(
    z.object({
      role: z.enum(["user", "model"]),
      parts: z.tuple([z.object({ text: z.string() })]),
    })
  ),
} as const;

export const DiscussionValidationRule = {
  refId: z.string(),
  refType: z.enum(["lesson", "liveSession"]),
  content: z
    .string()
    .min(1, getMinLengthMessage("content", 1))
    .max(500, getMaxLengthMessage("content", 500)),
  reply: {
    content: z
      .string()
      .min(1, getMinLengthMessage("content", 1))
      .max(500, getMaxLengthMessage("content", 500)),
  },
} as const;

export const ModuleValidationRule = {
  title: z
    .string()
    .min(5, getMinLengthMessage("title", 5))
    .max(100, getMaxLengthMessage("title", 100)),
} as const;

export const LessonValidationRule = {
  title: z
    .string()
    .min(5, getMinLengthMessage("title", 5))
    .max(100, getMaxLengthMessage("title", 100)),
  description: z
    .string()
    .min(10, getMinLengthMessage("description", 10))
    .max(2000, getMaxLengthMessage("description", 2000)),
  type: z.enum(["video", "pdf"]),
  duration: z.coerce.number(),
} as const;

export const LiveSessionValidationRule = {
  title: z
    .string()
    .min(5, getMinLengthMessage("title", 5))
    .max(100, getMaxLengthMessage("title", 100)),
  description: z
    .string()
    .min(10, getMinLengthMessage("description", 10))
    .max(2000, getMaxLengthMessage("description", 2000)),
  date: z.coerce.date(),
  time: z.string(),
} as const;

export const NotebookValidationRule = {
  title: z
    .string()
    .min(5, getMinLengthMessage("title", 5))
    .max(100, getMaxLengthMessage("title", 100)),
  notes: z.array(
    z
      .string()
      .min(10, getMinLengthMessage("notes", 10))
      .max(2000, getMaxLengthMessage("notes", 2000))
  ),
} as const;

export const QuestionValidationRule = {
  question: z
    .string()
    .min(10, getMinLengthMessage("question", 10))
    .max(500, getMaxLengthMessage("question", 500)),
  options: z
    .array(
      z.object({
        choice: z
          .string()
          .min(2, getMinLengthMessage("choice", 2))
          .max(100, getMaxLengthMessage("choice", 100)),
        id: z.string(),
      })
    )
    .min(2, getMinLengthMessage("options", 2)),
  answer: z
    .string()
    .min(2, getMinLengthMessage("answer", 2))
    .max(100, getMaxLengthMessage("answer", 100)),
} as const;

export const QuizValidationRule = {
  title: z.string().min(2, getMinLengthMessage("title", 2)),
  description: z.string().min(10, getMinLengthMessage("description", 10)),
  difficulty: z.enum(["beginner", "intermediate", "advance"]),
  topics: z.array(ObjectIDValidation),
} as const;

export const QuizFilterSortValidationRule = {
  difficulty: QuizValidationRule.difficulty.or(z.enum(["all"])),
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
} as const;

export const QuizSubmissionValidationRule = {
  timeTaken: z.number().min(0),
  answers: z.array(
    z.object({
      questionId: ObjectIDValidation,
      answer: z.string(),
    })
  ),
} as const;

export const ReviewValidationRule = {
  content: z
    .string()
    .min(10, getMinLengthMessage("content", 10))
    .max(500, getMaxLengthMessage("content", 500)),
  rating: z
    .number()
    .min(0, getMinValueMessage("rating", 0))
    .max(5, getMaxValueMessage("rating", 5))
    .default(0),
  reply: {
    content: z
      .string()
      .min(1, getMinLengthMessage("reply.content", 1))
      .max(500, getMaxLengthMessage("reply.content", 500)),
  },
} as const;

export const SubscriptionPlanValidationRule = {
  title: z
    .string()
    .min(5, getMinLengthMessage("title", 5))
    .max(100, getMaxLengthMessage("title", 100)),
  description: z
    .string()
    .min(10, getMinLengthMessage("description", 10))
    .max(2000, getMaxLengthMessage("description", 2000)),
  price: z.number().min(0, getMinValueMessage("price", 0)),
  duration: z.number().min(1, getMinValueMessage("duration", 1)),
  features: z.array(
    z.enum(
      Object.values(SUBSCRIPTION_FEATURE_IDS) as [
        ISubscriptionFeatureId,
        ...ISubscriptionFeatureId[]
      ]
    )
  ),
} as const;

export const SubscriptionPlanFilterValidationRule = {
  subscriptionPlanId: z.string().optional(),
} as const;

export const TopicValidationRule = {
  topicName: z
    .string()
    .min(2, getMinLengthMessage("topicName", 2))
    .max(20, getMaxLengthMessage("topicName", 20)),
} as const;

export const TrainerRequestValidationRule = {
  status: z.enum(["approved", "rejected"]),
  rejectedReason: z
    .string()
    .min(2, getMinLengthMessage("rejectedReason", 2))
    .max(200, getMaxLengthMessage("rejectedReason", 200))
    .optional(),
} as const;

export const TransactionFilterSortValidationRule = {
  filterType: z.enum(["daily", "monthly", "yearly", "all", "custom"]),
  startDate: z.string(),
  endDate: z.string(),
  exportType: z.enum(["pdf", "excel"]),
  status: z.enum([
    "all",
    "pending",
    "completed",
    "canceled",
    "failed",
    "on_process",
  ]),
  type: z.enum([
    "all",
    "course_purchase",
    "commission",
    "subscription",
    "wallet_redeem",
  ]),
} as const;
