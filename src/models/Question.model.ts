import { Document, ObjectId, Schema, model } from "mongoose";

export interface IQuestion extends Document {
  quizId: ObjectId;
  question: string;
  options: {
    choice: string;
    id: string;
  }[];
  answer: string;
}

const questionSchema = new Schema<IQuestion>(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz" },
    question: { type: String, required: true },
    options: [
      {
        choice: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IQuestion>("question", questionSchema);
