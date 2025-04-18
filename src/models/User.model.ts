import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  profileImage?: string;
  about?: string;
  role?: "user" | "trainer" | "admin";
  googleId?: string;
  isBlocked?: boolean;
  isPremium?: boolean;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
      required: false,
      default: "",
    },
    about: {
      type: String,
      required: false,
      default: "",
    },
    role: {
      type: "string",
      enum: ["user", "admin", "trainer"],
      required: false,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      required: false,
      default: false,
    },
    isPremium: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema);
