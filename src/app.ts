import express from "express";
import morgan from "morgan";
import errorHandler from "./middlewares/error.middleware";
import cors from "./config/CORS";
import cookieParser from "cookie-parser";
import nocache from "nocache";

//routes
import authRouter from "./routes/auth.router";
import userRouter from "./routes/user.router";
import adminRouter from "./routes/admin.router";
import TrainerRouter from "./routes/trainer.router";

const app = express();

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(nocache());

app.use("/auth", authRouter);
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/trainer", TrainerRouter);

app.use(errorHandler);

export default app;
