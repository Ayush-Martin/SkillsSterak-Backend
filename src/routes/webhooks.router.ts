import { Router } from "express";
import { liveKitWebhookController } from "../dependencyInjector";

const router = Router();

router.post("/livekit", liveKitWebhookController.handleWebhook);

export default router;
