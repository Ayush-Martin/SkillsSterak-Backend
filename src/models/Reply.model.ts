import { Document, ObjectId, Schema, model } from "mongoose";

export interface IReply extends Document {
  userId: ObjectId;
  entityId: ObjectId;
  content: string;
}

const ReplySchema = new Schema<IReply>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("reply", ReplySchema);
