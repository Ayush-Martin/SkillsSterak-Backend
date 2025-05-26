import e, { NextFunction, Request, Response } from "express";
import { IStreamService } from "../interfaces/services/IStream.service";
import binder from "../utils/binder";
import { receiver } from "../config/liveKit";

class LiveKitWebhookController {
  constructor(private streamService: IStreamService) {
    binder(this);
  }

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
