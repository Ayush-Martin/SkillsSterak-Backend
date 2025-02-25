import { Document, ObjectId, Schema, model } from "mongoose";

export interface ITrainerRequest extends Document {
  userId: ObjectId;
  status?: "pending" | "approved" | "rejected";
}

const TrainerRequestSchema = new Schema<ITrainerRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model("trainerRequest", TrainerRequestSchema);
