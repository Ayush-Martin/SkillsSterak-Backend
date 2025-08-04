import express from "express";
import morgan from "morgan";
import errorHandler from "./middlewares/error.middleware";
import cors from "./config/CORS";
import cookieParser from "cookie-parser";
import nocache from "nocache";
import router from "./routes/index.router";
import webhooksRouter from "./routes/webhooks.router";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use("/webhooks", webhooksRouter);

app.use(cookieParser());
app.use(morgan("dev"));
app.use(nocache());
app.use(cors);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api", express.json(), express.urlencoded({ extended: true }), router);


app.use(errorHandler);

export default app;
