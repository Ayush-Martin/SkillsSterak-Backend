import { z } from "zod";

export const SearchValidationRule = z.string().default("");

export const PageValidationRule = z.preprocess(
  (val) => Number(val),
  z.number().default(1)
);

export const PageRecordSizeValidationRule = z.preprocess(
  (val) => Number(val),
  z.number().default(5)
);
