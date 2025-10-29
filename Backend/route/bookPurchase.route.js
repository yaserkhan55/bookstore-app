// Backend/route/bookPurchaseRoutes.js
import express from "express";
import BookPurchase from "../models/BookPurchase.model.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// 🟣 Get user’s purchased books
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const purchases = await BookPurchase.find({ user: req.user.id })
      .populate("book") // ✅ Make sure the book is fully populated
      .sort({ createdAt: -1 });

    res.json({ success: true, purchases });
  } catch (err) {
    console.error("💥 Error fetching purchases:", err);
    res.status(500).json({ success: false, message: "Failed to fetch purchases" });
  }
});

export default router;
