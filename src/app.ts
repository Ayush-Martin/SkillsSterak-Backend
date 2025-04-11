import express from "express";
import morgan from "morgan";
import errorHandler from "./middlewares/error.middleware";
import cors from "./config/CORS";
import cookieParser from "cookie-parser";
import nocache from "nocache";
import router from "./routes/index.router";

const app = express();

app.use(cookieParser());
app.use(cors);

app.use("/live-kit", express.raw({ type: "application/webhook+json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(nocache());
app.use(router);

app.use(errorHandler);

export default app;
