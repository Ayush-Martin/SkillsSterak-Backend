import express from "express";
import morgan from "morgan";
import errorHandler from "./middlewares/error.middleware";
import cors from "./config/CORS";
import cookieParser from "cookie-parser";
import nocache from "nocache";

//routes
import authRouter from "./routes/auth.router";
import profileRouter from "./routes/profile.router";


const app = express();

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(nocache());

app.use("/auth", authRouter);
app.use("/user", profileRouter);

app.use(errorHandler);

export default app;
