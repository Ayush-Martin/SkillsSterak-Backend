import { z } from "zod";
import {
  PageValidationRule,
  TrainerRequestStatusValidationRule,
} from "../utils/validationRules";

export const getTrainerRequestValidator = (data: any) => {
  const schema = z.object({
    page: PageValidationRule,
  });

  return schema.parse(data);
};

export const approveRejectRequestValidator = (data: any) => {
  const schema = z.object({
    status: TrainerRequestStatusValidationRule,
  });

  return schema.parse(data);
};
