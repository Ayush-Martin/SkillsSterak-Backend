import { Schema, Document, ObjectId, model } from "mongoose";

export interface IStream extends Document {
  roomId: string;
  hostId: ObjectId;
  title: string;
  description: string;
  thumbnail: string;
  isLive?: boolean;
  isPublic: boolean;
  recordedSrc?: string;
  liveSrc?: string;
  courseId: ObjectId;
}

const StreamSchema = new Schema<IStream>(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    thumbnail: {
      type: String,
      required: true,
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    recordedSrc: {
      type: String,
      default: "",
    },
    liveSrc: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IStream>("Stream", StreamSchema);
