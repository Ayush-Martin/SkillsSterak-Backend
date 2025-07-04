import Stripe from "stripe";
import envConfig from "./env";

/**
 * Stripe instance initialized with the application's secret key for payment processing.
 */
const stripe = new Stripe(envConfig.STRIPE_SECRET_KEY);

export default stripe;
