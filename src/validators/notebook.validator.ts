import { z } from "zod";
import {
  NotebookNotesValidationRule,
  NotebookTitleValidationRule,
} from "./rules/notebook.validationRule";

export const addNoteBookValidator = (data: any) => {
  const schema = z.object({
    title: NotebookTitleValidationRule,
  });

  return schema.parse(data);
};

export const updateNoteBookValidator = (data: any) => {
  const schema = z.object({
    title: NotebookTitleValidationRule,
    notes: NotebookNotesValidationRule,
  });

  return schema.parse(data);
};
