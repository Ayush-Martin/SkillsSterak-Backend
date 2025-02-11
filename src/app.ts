import express, { NextFunction } from "express";
import morgan from "morgan";
import errorHandler from "./middlewares/error.middleware";

//routes
import authRouter from "./routes/auth.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/auth", authRouter);

app.use(errorHandler);

export default app;
