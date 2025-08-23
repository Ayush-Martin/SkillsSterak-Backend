import { z } from "zod";
import { NotebookValidationRule } from "../constants/validationRule";

export const addNoteBookValidator = (data: any) => {
  const schema = z.object({
    title: NotebookValidationRule.title,
  });

  return schema.parse(data);
};

export const updateNoteBookValidator = (data: any) => {
  const schema = z.object({
    title: NotebookValidationRule.title,
    notes: NotebookValidationRule.notes,
  });

  return schema.parse(data);
};
