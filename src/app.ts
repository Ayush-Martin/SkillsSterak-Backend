import express from "express";
import morgan from "morgan";

//routes
import testRouter from "./routes/test.router";

const app = express();
app.use(morgan("dev"));

app.use("/test", testRouter);

export default app;
