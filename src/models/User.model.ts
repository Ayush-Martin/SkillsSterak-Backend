import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profileImage?: string;
  about?: string;
  areaOfInterest?: string[];
  isTrainer?: boolean;
  isBlocked?: boolean;
  isPremium?: boolean;
}

const UserSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
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
  isTrainer: {
    type: Boolean,
    required: false,
    default: false,
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
});

export default model<IUser>("User", UserSchema);
