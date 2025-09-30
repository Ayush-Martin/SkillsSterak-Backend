import { z } from "zod";
import { PaginationValidationRule } from "../constants/validationRule";

export const getTrainerStudentsWithEnrolledCoursesValidator = (data: any) => {
  const schema = z.object({
    page: PaginationValidationRule.page,
    search: PaginationValidationRule.search,
    size: PaginationValidationRule.size,
    courseId: z.union([z.string(), z.literal("all")]),
  });

  return schema.parse(data);
};
