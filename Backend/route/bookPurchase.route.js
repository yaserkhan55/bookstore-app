// route/bookPurchase.route.js
import express from "express";
import BookPurchase from "../models/BookPurchase.model.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ✅ Save purchase manually after payment success
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { bookId, amount, paymentId } = req.body;

    if (!bookId || !amount) {
      return res.status(400).json({ success: false, message: "Missing bookId or amount" });
    }

    const purchase = await BookPurchase.create({
      user: req.user.id, // from JWT token
      book: bookId,
      amount,
      paymentId: paymentId || "manual-entry", // optional
      status: "success",
    });

    console.log("✅ Purchase recorded:", purchase._id);
    res.json({ success: true, purchase });
  } catch (err) {
    console.error("❌ Save purchase error:", err);
    res.status(500).json({ success: false, message: "Failed to save purchase" });
  }
});

// ✅ Get all purchases of current user
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const purchases = await BookPurchase.find({ user: req.user.id }).populate("book");
    res.json({ success: true, purchases });
  } catch (err) {
    console.error("❌ Fetch purchase error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch purchases" });
  }
});

export default router;
