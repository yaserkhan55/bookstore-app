// routes/paymentRoutes.js
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import PaidBook from "../models/PaidBook.js";
import Purchase from "../models/Purchase.js"; // ✅ Correct unified model
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ✅ Create Razorpay order
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { amount, bookId } = req.body;
    console.log("🟣 Create order request:", req.body);

    if (!bookId) {
      return res.json({ success: false, message: "Missing bookId" });
    }

    const book = await PaidBook.findById(bookId);
    if (!book) {
      console.error("❌ Paid book not found:", bookId);
      return res.json({ success: false, message: "Paid book not found" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    });

    console.log("✅ Razorpay order created:", order.id);

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.json({
      success: false,
      message: "Payment initiation failed. Please try again.",
      error: error.message,
    });
  }
});

// ✅ Verify payment & SAVE to DB
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookId,
      amount,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({ success: false, message: "Invalid signature" });
    }

    console.log("✅ Payment verified for book:", bookId);

    // 🟢 Save the successful purchase
    const newPurchase = await Purchase.create({
      userId: req.user.id, // ✅ matches your Purchase model
      bookId,
      amount,
      razorpay_order_id,
      razorpay_payment_id,
      status: "success",
    });

    console.log("💾 Purchase saved:", newPurchase._id);

    res.json({
      success: true,
      message: "Payment verified and purchase saved successfully",
      purchase: newPurchase,
    });
  } catch (error) {
    console.error("❌ Payment verification failed:", error);
    res.json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
});

export default router;
