import z from "zod";
import {
  AssignmentSubmissionValidationRule,
  AssignmentValidationRule,
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

export const editAssignmentValidator = createAssignmentValidator;
