import { Router } from "express";
import { liveKitController } from "../dependencyInjector";

const router = Router();


router.post("/", liveKitController.liveKit);

export default router;
