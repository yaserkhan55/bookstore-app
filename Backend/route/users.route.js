// Backend/route/user.route.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";

import User from "../models/User.js";
import Wishlist from "../models/Wishlist.js";

const router = express.Router();

// ✅ Get enrolled courses for the logged-in user
router.get("/enrollments", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("enrolledCourses");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ enrolledCourses: user.enrolledCourses || [] });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Get wishlist for the logged-in user
router.get("/wishlist", authMiddleware, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user._id }).populate("courseId");
    res.json({
      wishlist: wishlist.map((item) => ({
        _id: item._id,
        course: item.courseId,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
