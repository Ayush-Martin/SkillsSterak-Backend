import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  company?: string;
  position?: string;
  experiences?: {
    id: string;
    company: string;
    position: string;
    duration?: string;
    description?: string;
  }[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };

  education?: string;
  skills?: string[];
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
    location: {
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
    education: {
      type: String,
      required: false,
      default: "",
    },
    skills: {
      type: [String],
      required: false,
      default: [],
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
    experiences: {
      type: [
        {
          id: String,
          company: String,
          position: String,
          duration: String,
          description: String,
        },
      ],
      required: false,
      default: [],
    },
    socialLinks: {
      type: {
        github: String,
        linkedin: String,
        website: String,
        instagram: String,
        facebook: String,
        youtube: String,
      },
      required: false,
      default: {
        github: "",
        linkedin: "",
        website: "",
        instagram: "",
        facebook: "",
        youtube: "",
      },
    },
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema);
