import { z } from "zod";

export const ReviewContentValidationRule = z.string();

export const ReviewRatingValidationRule = z.number().min(0).max(5).default(0);

export const ReplyValidationRule = z.string();
