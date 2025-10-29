import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";
import Book from "../models/book.model.js";

const router = express.Router();

// 🧾 Razorpay config
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// 🟣 Create order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, bookId } = req.body;

    if (!bookId || !amount)
      return res
        .status(400)
        .json({ success: false, message: "bookId and amount are required" });

    // ✅ Ensure ObjectId is valid
    let validId;
    try {
      validId = new mongoose.Types.ObjectId(bookId);
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid bookId format" });
    }

    // ✅ Find the paid book
    const book = await Book.findOne({
      _id: validId,
      isFree: false,
    });

    if (!book) {
      console.error("❌ Paid book not found in DB:", bookId);
      return res
        .status(404)
        .json({ success: false, message: "Paid book not found" });
    }

    // ✅ Create Razorpay order
    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error while creating order" });
  }
});

// 🟢 Verify payment
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (err) {
    console.error("Verification error:", err);
    res
      .status(500)
      .json({ success: false, message: "Error verifying payment" });
  }
});

export default router;
