import z from "zod";
import {
  AiChatHistoryValidationRule,
  AiChatMessageValidationRule,
  CourseCategoryIdValidationRule,
  CourseDescriptionValidationRule,
  CourseDifficultyValidationRule,
  CoursePriceFilterValidationRule,
  CoursePriceValidationRule,
  CourseRequirementsValidationRule,
  CourseSkillsCoveredValidationRule,
  CourseSortValidationRule,
  CourseTitleValidationRule,
} from "./rules/course.validationRule";

import {
  PageRecordSizeValidationRule,
  PageValidationRule,
  SearchValidationRule,
} from "./rules/pagination.validationRule";

export const createCourseValidator = (data: any) => {
  const schema = z.object({
    title: CourseTitleValidationRule,
    price: CoursePriceValidationRule,
    skillsCovered: CourseSkillsCoveredValidationRule,
    requirements: CourseRequirementsValidationRule,
    difficulty: CourseDifficultyValidationRule,
    description: CourseDescriptionValidationRule,
    categoryId: CourseCategoryIdValidationRule,
  });

  return schema.parse(data);
};

export const updateCourseBasicDetailsValidator = (data: any) => {
  const schema = z.object({
    title: CourseTitleValidationRule,
    price: CoursePriceValidationRule,
    difficulty: CourseDifficultyValidationRule,
    description: CourseDescriptionValidationRule,
    categoryId: CourseCategoryIdValidationRule,
    requirements: z.array(z.string()),
    skillsCovered: z.array(z.string()),
  });

  return schema.parse(data);
};

export const getCoursesValidator = (data: any) => {
  const schema = z.object({
    search: SearchValidationRule,
    page: PageValidationRule,
    difficulty: CourseDifficultyValidationRule.or(z.enum(["all"])),
    category: z.string(),
    price: CoursePriceFilterValidationRule,
    size: PageRecordSizeValidationRule,
    sort: CourseSortValidationRule,
  });

  return schema.parse(data);
};

export const approveRejectCourseValidator = (data: any) => {
  const schema = z.object({
    status: z.enum(["approved", "rejected"]),
  });

  return schema.parse(data);
};

export const aiChatValidator = (data: any) => {
  const schema = z.object({
    message: AiChatMessageValidationRule,
    history: AiChatHistoryValidationRule,
  });

  return schema.parse(data);
};
