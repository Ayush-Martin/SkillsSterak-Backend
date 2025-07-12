import { config } from "dotenv";
config();

/** Environment configuration */
const envConfig = {
  //general
  PORT: process.env.PORT || 5000,
  FRONTEND_PORT: process.env.FRONTEND_PORT || 4000,
  FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN || "http://localhost:4000",
  APP_NAME: process.env.APP_NAME || "SkillsStreak",
  COURSE_CANCELLATION_HOURS: Number(process.env.COURSE_CANCELLATION_HOURS) || 5,
  NODE_ENV:
    (process.env.NODE_ENV as "development" | "production") || "development",

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

  //Gemini
  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,

  //LiveKit
  LIVEKIT_HOST: process.env.LIVEKIT_HOST!,
  LIVEKIT_URL: process.env.LIVEKIT_URL!,
  LIVEKIT_API_KEY: process.env.LIVEKIT_API_KEY!,
  LIVEKIT_API_SECRET: process.env.LIVEKIT_API_SECRET!,

  //AWS
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  AWS_REGION: process.env.AWS_REGION!,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME!,
  AWS_ENDPOINT: process.env.AWS_ENDPOINT!,
  AWS_BUCKET_URL: process.env.AWS_BUCKET_URL!,

  //Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
  STRIPE_SUBSCRIPTION_PREMIUM_PRICE_ID:
    process.env.STRIPE_SUBSCRIPTION_PREMIUM_PRICE_ID!,
};

export default envConfig;
