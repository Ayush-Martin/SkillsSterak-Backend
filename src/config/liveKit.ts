import { EgressClient, WebhookReceiver } from "livekit-server-sdk";
import envConfig from "./env";

export const receiver = new WebhookReceiver(
  envConfig.LIVEKIT_API_KEY,
  envConfig.LIVEKIT_API_SECRET
);

export const egressClient = new EgressClient(
  envConfig.LIVEKIT_HOST,
  envConfig.LIVEKIT_API_KEY,
  envConfig.LIVEKIT_API_SECRET
);
