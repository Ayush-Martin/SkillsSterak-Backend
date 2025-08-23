import { z } from "zod";
import mongoose, { ObjectId } from "mongoose";
import {
  PaginationValidationRule,
  QuizFilterSortValidationRule,
  QuizValidationRule,
} from "../constants/validationRule";

export const addQuizValidator = (data: any) => {
  const schema = z.object({
    title: QuizValidationRule.title,
    description: QuizValidationRule.description,
    difficulty: QuizValidationRule.difficulty,
    topics: QuizValidationRule.topics,
  });

  return schema.parse(data);
};

export const editQuizValidator = addQuizValidator;

export const getUserQuizzesValidator = (data: any) => {
  const schema = z.object({
    page: PaginationValidationRule.page,
    size: PaginationValidationRule.size,
    search: PaginationValidationRule.search,
    difficulty: QuizFilterSortValidationRule.difficulty,
    topics: QuizFilterSortValidationRule.topics,
  });

  return schema.parse(data);
};
