import { Schema, Document, model, ObjectId } from "mongoose";

export interface IChat extends Document {
  chatType: "group" | "individual";
  adminId?: ObjectId;
  courseId?: ObjectId;
  members: Array<ObjectId>;
}

const ChatSchema = new Schema<IChat>(
  {
    chatType: {
      type: String,
      enum: ["group", "individual"],
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: false,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default model("chats", ChatSchema);
