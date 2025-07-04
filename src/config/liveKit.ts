import { EgressClient, WebhookReceiver } from "livekit-server-sdk";
import envConfig from "./env";

/**
 * LiveKit WebhookReceiver for handling webhook events from LiveKit server.
 */
export const receiver = new WebhookReceiver(
  envConfig.LIVEKIT_API_KEY,
  envConfig.LIVEKIT_API_SECRET
);

/**
 * LiveKit EgressClient for managing egress (recording/streaming) operations.
 */
export const egressClient = new EgressClient(
  envConfig.LIVEKIT_HOST,
  envConfig.LIVEKIT_API_KEY,
  envConfig.LIVEKIT_API_SECRET
);
