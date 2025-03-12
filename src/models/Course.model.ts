import { Document, ObjectId, Schema, model } from "mongoose";

export interface ICourse extends Document {
  trainerId: ObjectId;
  title: string;
  price: number;
  skillsCovered: Array<String>;
  requirements: Array<String>;
  difficulty: "beginner" | "intermediate" | "advance";
  thumbnail: string;
  description: string;
  categoryId: ObjectId;
  isListed?: boolean;
  status?: "pending" | "approved" | "rejected";
}

const CourseSchema = new Schema<ICourse>(
  {
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    skillsCovered: {
      type: [{ type: String, required: true }],
      required: true,
    },
    requirements: {
      type: [{ type: String, required: true }],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advance"],
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    isListed: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model("course", CourseSchema);
