import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  profileImage?: string;
  about?: string;
  areaOfInterest?: string[];
  role?: "user" | "trainer" | "admin" | "premium";
  googleId?: string;
  isBlocked?: boolean;
}

const UserSchema: Schema<IUser> = new Schema({
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
  areaOfInterest: {
    type: Array<String>,
    required: false,
  },
  about: {
    type: String,
    required: false,
    default: "",
  },
  role: {
    type: "string",
    enum: ["user", "admin", "trainer", "premium"],
    required: false,
    default: "user",
  },
  isBlocked: {
    type: Boolean,
    required: false,
    default: false,
  },
});

export default model<IUser>("User", UserSchema);
