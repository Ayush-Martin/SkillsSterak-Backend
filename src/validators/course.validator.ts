import z from "zod";
import {
  CourseCategoryIdValidationRule,
  CourseDescriptionValidationRule,
  CourseDifficultyValidationRule,
  CoursePriceValidationRule,
  CourseRequirementsValidationRule,
  CourseSkillsCoveredValidationRule,
  CourseTitleValidationRule,
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
