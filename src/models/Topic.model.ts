import { Document, Schema, model } from "mongoose";

export interface ITopic extends Document {
  topicName: string;
}

const TopicSchema = new Schema<ITopic>(
  {
    topicName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<ITopic>("topic", TopicSchema);
