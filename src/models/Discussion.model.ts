import { Document, Schema, model } from "mongoose";

export interface IDiscussion extends Document {
  content: string;
  refId: Schema.Types.ObjectId;
  refType: "lesson" | "liveSession";
  userId: Schema.Types.ObjectId;
}

const DiscussionSchema = new Schema<IDiscussion>(
  {
    content: {
      type: String,
      required: true,
    },
    refId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "refType",
    },
    refType: {
      type: String,
      required: true,
      enum: ["lesson", "liveSession"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IDiscussion>("discussion", DiscussionSchema);
