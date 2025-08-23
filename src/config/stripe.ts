import Stripe from "stripe";
import envConfig from "./env";

/**
 * Stripe client instance for handling payment processing.
 *
 * Initialized with the application's secret key from environment variables.
 * Can be used to create charges, manage subscriptions, handle webhooks, and more.
 */
const stripe = new Stripe(envConfig.STRIPE_SECRET_KEY);

export default stripe;
