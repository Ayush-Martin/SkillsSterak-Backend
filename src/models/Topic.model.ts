import { Document, Schema, model } from "mongoose";

export interface ITopic extends Document {
  title: string;
}

const TopicSchema = new Schema<ITopic>(
  {
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<ITopic>("topic", TopicSchema);
