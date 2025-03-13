import { z } from "zod";
import {
  PageValidationRule,
  TrainerRequestStatusValidationRule,
} from "../utils/validationRules";

export const approveRejectRequestValidator = (data: any) => {
  const schema = z.object({
    status: TrainerRequestStatusValidationRule,
  });

  return schema.parse(data);
};
