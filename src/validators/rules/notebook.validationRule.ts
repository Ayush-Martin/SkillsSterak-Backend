import { z } from "zod";

export const NotebookTitleValidationRule = z.string();

export const NotebookNotesValidationRule = z.array(z.string());
