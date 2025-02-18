import { Schema, model, Document } from "mongoose";

export interface IRefreshToken extends Document {
  token: string;
}

const RefreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
});

export default model<IRefreshToken>("refreshToken", RefreshTokenSchema);
