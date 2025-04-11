import { z } from "zod";
import { TrainerRequestStatusValidationRule } from "./rules/trainerRequest.validationRule";

export const approveRejectRequestValidator = (data: any) => {
  const schema = z.object({
    status: TrainerRequestStatusValidationRule,
  });

  return schema.parse(data);
};
