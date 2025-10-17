// backend/route/paymentRoutes.js
import express from "express";
import crypto from "crypto";
import razorpayInstance from "../config/razorpay.js";
import { authMiddleware } from "../middleware/auth.js";
import BookPurchase from "../models/BookPurchase.model.js";

const router = express.Router();

// 🟣 Create Razorpay order
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    console.log("🟣 Create order request:", req.body);
    const { amount, bookId } = req.body;

    if (!amount || !bookId) {
      return res.status(400).json({ success: false, message: "Missing amount or bookId" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `book_${bookId}_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    console.log("✅ Razorpay order created:", order.id);

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (err) {
    console.error("💥 Razorpay order error:", err);
    res.status(500).json({ success: false, message: "Razorpay order creation failed" });
  }
});

// 🟣 Verify payment & save purchase
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookId, amount } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // ✅ Save successful purchase
    await BookPurchase.create({
      user: req.user._id,
      book: bookId,
      amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status: "success",
    });

    console.log(`✅ Purchase saved for user ${req.user._id}, book ${bookId}`);

    res.json({ success: true, message: "Payment verified and purchase saved" });
  } catch (err) {
    console.error("💥 Payment verification error:", err);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
});

export default router;
