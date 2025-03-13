import z from "zod";
import {
  CourseCategoryIdValidationRule,
  CourseDescriptionValidationRule,
  CourseDifficultyValidationRule,
  CoursePriceFilterValidationRule,
  CoursePriceValidationRule,
  CourseRequirementsValidationRule,
  CourseSkillsCoveredValidationRule,
  CourseTitleValidationRule,
  PageValidationRule,
  SearchValidationRule,
} from "../utils/validationRules";

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
  });

  return schema.parse(data);
};

export const updateCourseRequirementsValidator = (data: any) => {
  const schema = z.object({
    requirements: z.array(z.string()),
  });

  return schema.parse(data);
};

export const updateCourseSkillsCoveredValidator = (data: any) => {
  const schema = z.object({
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
  });

  return schema.parse(data);
};

export const approveRejectCourseValidator = (data: any) => {
  const schema = z.object({
    status: z.enum(["approved", "rejected"]),
  });

  return schema.parse(data);
};
