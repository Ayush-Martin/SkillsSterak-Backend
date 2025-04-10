import { config } from "dotenv";
config();
console.log(process.env.ACCESS_TOKEN_EXPIRY_MIN);

const envConfig = {
  //general
  PORT: process.env.PORT || 5000,
  FRONTEND_PORT: process.env.FRONTEND_PORT || 4000,
  FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN || "http://localhost:4000",
  APP_NAME: process.env.APP_NAME || "SkillsStreak",

  //mongoDb
  MONGO_URI: process.env.MONGO_URI!,

  //bcrypt
  PASSWORD_SALT_ROUNDS: Number(process.env.PASSWORD_SALT_ROUNDS) || 12,

  //JWT
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
  ACCESS_TOKEN_EXPIRY_MIN: Number(process.env.ACCESS_TOKEN_EXPIRY_MIN) || 15,
  REFRESH_TOKEN_EXPIRY_DAY: Number(process.env.REFRESH_TOKEN_EXPIRY_DAY) || 7,

  //Mailer
  NODEMAILER_USER: process.env.NODEMAILER_USER!,
  NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD!,

  //Google O auth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL!,

  //Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,

  //Razorpay
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID!,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET!,

  //Gemini
  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,

  //Zego cloud
  ZEGO_APP_ID: Number(process.env.ZEGO_APP_ID!),
  ZEGO_SERVER_SECRET: process.env.ZEGO_SERVER_SECRET!,
  ZEGO_SERVER_URL: process.env.ZEGO_SERVER_URL!,

  //LiveKit
  LIVEKIT_URL: process.env.LIVEKIT_URL!,
  LIVEKIT_API_KEY: process.env.LIVEKIT_API_KEY!,
  LIVEKIT_API_SECRET: process.env.LIVEKIT_API_SECRET!,
};

export default envConfig;
