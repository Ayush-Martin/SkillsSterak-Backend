import express, { Router } from "express";
import { webhookController } from "../dependencyInjector";

const router = Router();

router.post(
  "/livekit",
  express.raw({ type: "application/webhook+json" }),
  webhookController.liveKit
);
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  webhookController.stripe
);

export default router;
