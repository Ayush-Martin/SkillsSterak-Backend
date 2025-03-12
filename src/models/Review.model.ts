import { Document, ObjectId, Schema, model } from "mongoose";

export interface IReview extends Document {
  userId: ObjectId;
  courseId: ObjectId;
  rating: number;
  content: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IReview>("review", ReviewSchema);
