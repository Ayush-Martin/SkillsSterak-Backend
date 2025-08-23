import { EgressClient, WebhookReceiver } from "livekit-server-sdk";
import envConfig from "./env";

/**
 * LiveKit WebhookReceiver instance.
 *
 * Handles incoming webhook events from the LiveKit server.
 * Initialized using API key and secret from environment variables.
 */
export const receiver = new WebhookReceiver(
  envConfig.LIVEKIT_API_KEY,
  envConfig.LIVEKIT_API_SECRET
);

/**
 * LiveKit EgressClient instance.
 *
 * Used for managing egress operations such as recording and streaming.
 * Initialized with host, API key, and secret from environment variables.
 */
export const egressClient = new EgressClient(
  envConfig.LIVEKIT_HOST,
  envConfig.LIVEKIT_API_KEY,
  envConfig.LIVEKIT_API_SECRET
);
