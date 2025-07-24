import { Schema, Document, ObjectId, model } from "mongoose";

export interface ILiveSession extends Document {
  courseId: ObjectId;
  title: string;
  description: string;
  date: Date;
  time: string;
  status: "upcoming" | "live" | "completed";
  liveSrc?: string;
  recordedSrc?: string;
}

const LiveSessionSchema = new Schema<ILiveSession>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },
    liveSrc: {
      type: String,
      required: false,
      default: "",
    },
    recordedSrc: {
      type: String,
      required: false,
      default: "",
    },
  },
  { timestamps: true }
);

export default model<ILiveSession>("liveSession", LiveSessionSchema);
