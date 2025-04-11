import { Schema, Document, ObjectId, model } from "mongoose";

export interface IStream extends Document {
  roomId: string;
  hostId: ObjectId;
  title: string;
  description: string;
  thumbnail: string;
  isLive?: boolean;
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
  },
  { timestamps: true }
);

export default model<IStream>("Stream", StreamSchema);
