import express from "express";
import Purchase from "../models/Purchase.js"; // ✅ unified model
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/**
 * 📊 Dashboard route
 * Shows total number of books purchased by the logged-in user
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("🟣 Fetching dashboard data for user:", req.user.id);

    const totalPurchases = await Purchase.countDocuments({ userId: req.user.id });

    console.log(`📘 User ${req.user.id} has purchased ${totalPurchases} book(s)`);

    return res.json({
      success: true,
      data: { totalPurchases },
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
