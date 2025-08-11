/**
 * General application constants used throughout the backend.
 */
export const RECORDS_PER_PAGE = 2;
export const COURSE_COMMISSION_RATE = 0.1; // 10%
export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

export const SUBSCRIPTION_FEATURE_IDS = {
  TRAINER_CHAT: "trainer_chat",
  LIVE_SESSION: "live_session",
} as const;

export type ISubscriptionFeatureId =
  (typeof SUBSCRIPTION_FEATURE_IDS)[keyof typeof SUBSCRIPTION_FEATURE_IDS];
