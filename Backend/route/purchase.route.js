import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import Purchase from "../models/Purchase.js";
import PaidBook from "../models/PaidBook.js";

const router = express.Router();

// ✅ Get user's purchased books
router.get("/my", authMiddleware, async (req, res) => {
  try {
    console.log("🟣 Fetching purchases for user:", req.user.id);

    const purchases = await Purchase.find({ userId: req.user.id })
      .populate({
        path: "bookId",
        model: "PaidBook",
        select: "title author cover price",
      })
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${purchases.length} purchases for user ${req.user.id}`);

    const userBooks = purchases
      .filter((p) => p.bookId)
      .map((p) => ({
        _id: p.bookId._id,
        title: p.bookId.title,
        author: p.bookId.author,
        cover: p.bookId.cover,
        price: p.bookId.price,
        purchasedAt: p.createdAt,
      }));

    res.json({ success: true, books: userBooks });
  } catch (err) {
    console.error("💥 Error fetching purchases:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch purchased books",
    });
  }
});

export default router;
  