import { Document, Schema, model } from "mongoose";

export interface IAssignment extends Document {
  title: string;
  description: string;
  task: string;
  courseId: Schema.Types.ObjectId;
}

const AssignmentSchema = new Schema<IAssignment>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
});

export default model<IAssignment>("assignment", AssignmentSchema);
