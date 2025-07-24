import z from "zod";

export const createAssignmentValidator = (data: any) => {
  const schema = z.object({
    title: z.string(),
    description: z.string(),
    task: z.string(),
  });

  return schema.parse(data);
};

export const submitAssignmentValidator = (data: any) => {
  const schema = z.object({
    type: z.enum(["text", "image", "pdf"]),
    content: z.string().optional(),
  });

  return schema.parse(data);
};

export const changeAssignmentSubmissionStatusValidator = (data: any) => {
  const schema = z.object({
    status: z.enum(["verified", "redo"]),
  });

  return schema.parse(data);
};

export const editAssignmentValidator = createAssignmentValidator;
