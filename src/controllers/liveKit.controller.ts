import { Request, Response, NextFunction } from "express";
import binder from "../utils/binder";
import { WebhookReceiver } from "livekit-server-sdk";
import envConfig from "../config/env";

class LiveKitController {
  constructor() {
    binder(this);
  }

  public async liveKit(req: Request, res: Response, next: NextFunction) {
    try {
      const receiver = new WebhookReceiver(
        envConfig.LIVEKIT_API_KEY,
        envConfig.LIVEKIT_API_SECRET
      );

      const { event, room } = await receiver.receive(
        req.body,
        req.get("Authorization")
      );

      switch (event) {
        case "room_started":
          console.log("Room started", room?.name);
          break;
        case "room_finished":
          console.log("Room ended", room?.name);
          break;
        default:
          console.log("Unknown event", event, room?.name);
      }
    } catch (err) {
      next(err);
    }
  }
}

export default LiveKitController;
