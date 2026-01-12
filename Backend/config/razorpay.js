// backend/config/razorpay.js
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

/**
 * ✅ Robust Razorpay initialization
 * - Does NOT throw errors on import
 * - Logs a warning if keys are missing
 * - Exports null-safe instance (won’t crash build)
 */

let razorpayInstance = null;

try {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.warn(
      "⚠️  Razorpay keys are missing in environment variables. Add them in your provider settings."
    );
  } else {
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
    console.log("✅ Razorpay initialized successfully");
  }
} catch (err) {
  console.error("❌ Failed to initialize Razorpay:", err.message);
  // Do not throw — prevents crash during build/startup
}

export default razorpayInstance;
