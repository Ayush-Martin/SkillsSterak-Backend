import { ICourse } from "../models/Course.model";

export const generatePrompt = (
  title: string,
  data: ICourse,
  message: string
) => {
  return `You are an AI tutor for the "${title}" course. The course contains the following modules and lessons: ${JSON.stringify(
    data
  )}.
      
      Use this information to answer the user's questions clearly and accurately. Avoid using any Markdown formatting like **bold** or *bullets* — use plain text only. Keep your responses concise and helpful, with a limit of 400 words.
      
      Here is the user's question: "${message}"`;
};
