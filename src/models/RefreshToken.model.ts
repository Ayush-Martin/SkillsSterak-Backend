import { Schema, model, Document } from "mongoose";

export interface IRefreshToken extends Document {
  token: string;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IRefreshToken>("refreshToken", RefreshTokenSchema);
