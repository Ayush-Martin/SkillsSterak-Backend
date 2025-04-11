import { z } from "zod";

export const TrainerRequestStatusValidationRule = z.enum(
  ["approved", "rejected"],
  { message: "trainer request status is missing or not in correct format" }
);
