import e, { NextFunction, Request, Response } from "express";
import { IStreamService } from "../interfaces/services/IStream.service";
import binder from "../utils/binder";
import { receiver } from "../config/liveKit";

/** LiveKitWebhook controller: handles LiveKit webhook events */
class LiveKitWebhookController {
  /** Injects stream service */
  constructor(private streamService: IStreamService) {
    binder(this);
  }

  /** Handle LiveKit webhook event */
  public async handleWebhook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const authHeader = req.headers["authorization"] as string;

      const event = await receiver.receive(req.body, authHeader);
      console.log("✅ Webhook event:", event.event, event.room?.name);

      if (event.participant?.name !== "host") {
        return res.status(400).json({
          message: "Webhook received successfully",
        });
      }

      switch (event.event) {
        case "participant_joined":
          console.log("⏳ Waiting 1s before starting recording...");
          await new Promise((res) => setTimeout(res, 1000));
          await this.streamService.startRecording(event.room?.name!);
          break;
        case "participant_left":
          await this.streamService.endStream(event.room?.name!);

          break;
      }

      res.status(200).json({
        message: "Webhook received successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default LiveKitWebhookController;
