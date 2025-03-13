import { Router } from "express";
const router = Router();

//routes
import authRouter from "./auth.router";
import userRouter from "./user.router";
import adminRouter from "./admin.router";
import TrainerRouter from "./trainer.router";

router.use("/auth", authRouter);
router.use("/", userRouter);
router.use("/admin", adminRouter);
router.use("/trainer", TrainerRouter);

export default router;
