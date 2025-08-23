import z from "zod";
import {
  AiChatValidationRule,
  CourseFilterSortValidationRule,
  CourseValidationRule,
  PaginationValidationRule,
} from "../constants/validationRule";

export const createCourseValidator = (data: any) => {
  const schema = z.object({
    title: CourseValidationRule.title,
    price: CourseValidationRule.price,
    skillsCovered: CourseValidationRule.skillsCovered,
    requirements: CourseValidationRule.requirements,
    difficulty: CourseValidationRule.difficulty,
    description: CourseValidationRule.description,
    categoryId: CourseValidationRule.categoryId,
  });

  return schema.parse(data);
};

export const updateCourseBasicDetailsValidator = (data: any) => {
  const schema = z.object({
    title: CourseValidationRule.title,
    price: CourseValidationRule.price,
    difficulty: CourseValidationRule.difficulty,
    description: CourseValidationRule.description,
    categoryId: CourseValidationRule.categoryId,
    requirements: CourseValidationRule.requirements,
    skillsCovered: CourseValidationRule.skillsCovered,
  });

  return schema.parse(data);
};

export const getCoursesValidator = (data: any) => {
  ``;
  const schema = z.object({
    search: PaginationValidationRule.search,
    page: PaginationValidationRule.page,
    difficulty: CourseFilterSortValidationRule.difficulty,
    category: CourseFilterSortValidationRule.category,
    price: CourseFilterSortValidationRule.price,
    size: PaginationValidationRule.size,
    sort: CourseFilterSortValidationRule.sort,
  });

  return schema.parse(data);
};

export const approveRejectCourseValidator = (data: any) => {
  const schema = z.object({
    status: CourseValidationRule.status,
  });

  return schema.parse(data);
};

export const aiChatValidator = (data: any) => {
  const schema = z.object({
    message: AiChatValidationRule.message,
    history: AiChatValidationRule.history,
  });

  return schema.parse(data);
};
