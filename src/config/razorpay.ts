import Razorpay from "razorpay";
import envConfig from "./env";

const razorpay = new Razorpay({
  key_id: envConfig.RAZORPAY_KEY_ID,
  key_secret: envConfig.RAZORPAY_KEY_SECRET,
});

export default razorpay;
