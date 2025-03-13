import { date, z } from "zod";
import { ModuleTitleValidationRule } from "../utils/validationRules";

export const addModuleValidator = (data: any) => {
  const schema = z.object({
    title: ModuleTitleValidationRule,
  });

  return schema.parse(data);
};

export const editModuleTitleValidator = addModuleValidator;
