import { z } from "zod";
import {
  PageValidationRule,
  SearchValidationRule,
} from "../utils/validationRules";

export const getStudentsWithEnrolledCoursesValidator = (data: any) => {
  const schema = z.object({
    search: SearchValidationRule,
    page: PageValidationRule,
  });

  return schema.parse(data);
};
