import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  profileImage?: string;
  bio?: string;
  place?: string;
  company?: string;
  position?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
  role?: "user" | "trainer" | "admin";
  googleId?: string;
  isBlocked?: boolean;
  isPremium?: boolean;
  stripeAccountId?: string;
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
    bio: {
      type: String,
      required: false,
      default: "",
    },
    place: {
      type: String,
      required: false,
      default: "",
    },
    company: {
      type: String,
      required: false,
      default: "",
    },
    position: {
      type: String,
      required: false,
      default: "",
    },
    socialLinks: {
      type: {
        github: {
          type: String,
          required: false,
          default: "",
        },
        linkedin: {
          type: String,
          required: false,
          default: "",
        },
        website: {
          type: String,
          required: false,
          default: "",
        },
      },
      default: {},
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
    stripeAccountId: {
      type: String,
      required: false,
      default: "",
    },
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema);
