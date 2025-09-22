import z from "zod";
import {
  AssignmentSubmissionValidationRule,
  AssignmentValidationRule,
  PaginationValidationRule,
} from "../constants/validationRule";

export const createAssignmentValidator = (data: any) => {
  const schema = z.object({
    title: AssignmentValidationRule.Title,
    description: AssignmentValidationRule.Description,
    task: AssignmentValidationRule.Task,
  });

  return schema.parse(data);
};

export const submitAssignmentValidator = (data: any) => {
  const schema = z.object({
    type: AssignmentSubmissionValidationRule.type,
    content: AssignmentSubmissionValidationRule.content.optional(),
  });

  return schema.parse(data);
};

export const changeAssignmentSubmissionStatusValidator = (data: any) => {
  const schema = z.object({
    status: AssignmentSubmissionValidationRule.status,
  });

  return schema.parse(data);
};

export const getAssignmentSubmissionsValidator = (data: any) => {
  const schema = z.object({
    page: PaginationValidationRule.page,
    size: PaginationValidationRule.size,
    search: PaginationValidationRule.search,
    status: z.enum(["completed", "verified", "redo", "all"]),
    courseId: z.union([z.string(), z.literal("all")]),
  });

  return schema.parse(data);
};

export const editAssignmentValidator = createAssignmentValidator;
