import { Document, ObjectId, Schema, model } from "mongoose";

export interface IQuizSubmission extends Document {
  userId: ObjectId;
  quizId: ObjectId;
  score: number;
  timeTaken: number;
  answers: Array<{ questionId: ObjectId; answer: string }>;
}

const quizSubmissionSchema = new Schema<IQuizSubmission>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    quizId: { type: Schema.Types.ObjectId, required: true, ref: "Quiz" },
    score: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
    answers: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Question",
        },
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default model<IQuizSubmission>("quizSubmission", quizSubmissionSchema);
