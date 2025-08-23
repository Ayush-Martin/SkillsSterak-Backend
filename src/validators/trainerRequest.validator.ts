import { z } from "zod";
import { TrainerRequestValidationRule } from "../constants/validationRule";

export const approveRejectRequestValidator = (data: any) => {
  const schema = z.object({
    status: TrainerRequestValidationRule.status,
    rejectedReason: TrainerRequestValidationRule.rejectedReason,
  });

  return schema.parse(data);
};
