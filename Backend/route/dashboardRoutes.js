import express from "express";
import Book from "../models/Book.model.js";
import BookPurchase from "../models/BookPurchase.model.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// 📊 Dashboard data route
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Count total users
    const totalUsers = await User.countDocuments();

    // Count total books
    const totalBooks = await Book.countDocuments();

    // Count paid books (price > 0)
    const totalPaidBooks = await Book.countDocuments({ price: { $gt: 0 } });

    // Count total purchases by current user
    const totalPurchases = await BookPurchase.countDocuments({ user: req.user.id });

    return res.json({
      success: true,
      data: { totalUsers, totalBooks, totalPaidBooks, totalPurchases },
    });
  } catch (err) {
    console.error("💥 Dashboard error:", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: err.message,
    });
  }
});

export default router;
