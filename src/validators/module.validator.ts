import { date, z } from "zod";
import { ModuleValidationRule } from "../constants/validationRule";

export const addModuleValidator = (data: any) => {
  const schema = z.object({
    title: ModuleValidationRule.title,
  });

  return schema.parse(data);
};

export const editModuleTitleValidator = addModuleValidator;
