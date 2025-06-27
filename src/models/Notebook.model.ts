import mongoose, { Document, model, ObjectId, Schema } from "mongoose";

export interface INotebook extends Document {
  title: string;
  notes: string[];
  lessonId: ObjectId;
  courseId: ObjectId;
  userId: ObjectId;
}

const NotebooksSchema = new Schema<INotebook>(
  {
    title: {
      type: String,
      required: true,
    },
    notes: {
      type: [String],
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "lessons",
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "courses",
    },
  },
  { timestamps: true }
);

export default model("notebooks", NotebooksSchema);
