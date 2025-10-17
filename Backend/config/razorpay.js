// backend/config/razorpay.js
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error("❌ Razorpay keys missing in .env (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)");
}

const instance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

console.log("✅ Razorpay initialized");

export default instance;
