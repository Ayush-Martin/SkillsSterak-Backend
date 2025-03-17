import { Document, ObjectId, Schema, model } from "mongoose";

export interface INotification extends Document {
  message: string;
  userId: ObjectId;
  read?: boolean;
}

const NotificationSchema = new Schema<INotification>(
  {
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model("notification", NotificationSchema);
