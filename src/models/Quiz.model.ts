import { Document, ObjectId, Schema, model } from "mongoose";

export interface IQuiz extends Document {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advance";
  topics: Array<ObjectId>;
  isListed?: boolean;
}

const QuizSchema = new Schema<IQuiz>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advance"],
      required: true,
    },
    topics: {
      type: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
      required: true,
    },
    isListed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

export default model<IQuiz>("quiz", QuizSchema);
