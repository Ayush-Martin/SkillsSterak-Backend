import { Document, Schema, model } from "mongoose";

export interface IAssignmentSubmission extends Document {
  assignmentId: Schema.Types.ObjectId;
  courseId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  status: "completed" | "pending" | "verified" | "redo";
  type: "text" | "pdf" | "image";
  path?: string;
  content?: string;
  remarks?: string;
}

const AssignmentSubmissionSchema = new Schema<IAssignmentSubmission>({
  assignmentId: {
    type: Schema.Types.ObjectId,
    ref: "assignment",
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["completed", "pending", "verified", "redo"],
    default: "pending",
  },
  type: {
    type: String,
    enum: ["text", "pdf", "image"],
    default: "text",
  },
  path: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: false,
  },
  remarks: {
    type: String,
    required: false,
  },
});

export default model("assignmentSubmissions", AssignmentSubmissionSchema);
