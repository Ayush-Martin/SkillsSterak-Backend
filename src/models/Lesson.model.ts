import { Document, ObjectId, Schema, model } from "mongoose";

export interface ILesson extends Document {
  title: string;
  courseId: ObjectId;
  moduleId: ObjectId;
  description: string;
  type: "video" | "pdf";
  path: string;
  duration: number;
}

const LessonSchema = new Schema<ILesson>({
  title: {
    type: String,
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
  moduleId: {
    type: Schema.Types.ObjectId,
    ref: "module",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["video", "pdf"],
  },
  path: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
});

export default model("lesson", LessonSchema);
