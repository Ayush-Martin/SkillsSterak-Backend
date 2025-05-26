import { EgressClient, WebhookReceiver } from "livekit-server-sdk";
import envConfig from "./env";

export const receiver = new WebhookReceiver(
  envConfig.LIVEKIT_API_KEY,
  envConfig.LIVEKIT_API_SECRET
);

export const egressClient = new EgressClient(
  "https://skillsstreak-hqejrm1a.livekit.cloud",
  envConfig.LIVEKIT_API_KEY,
  envConfig.LIVEKIT_API_SECRET
);
