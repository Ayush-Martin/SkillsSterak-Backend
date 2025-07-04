import { Document, ObjectId, Schema, model } from "mongoose";

export interface INotification extends Document {
  message: string;
  image?: string;
  link?: string;
  userId: ObjectId;
  read?: boolean;
}

const NotificationSchema = new Schema<INotification>(
  {
    message: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: "",
    },
    link: {
      type: String,
      required: false,
      default: "",
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
