import express from "express";
import Wishlist from "../models/Wishlist.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get user’s wishlist
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await Wishlist.findOne({ userId }).populate("courses");
    const courses = wishlist?.courses || [];
    res.json({ success: true, courses, count: courses.length });
  } catch (err) {
    console.error("❌ Wishlist fetch error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch wishlist", count: 0 });
  }
});

// ✅ Add course to wishlist
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ success: false, message: "Course ID is required" });

    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) wishlist = new Wishlist({ userId: req.user.id, courses: [] });

    if (wishlist.courses.includes(courseId)) {
      return res.json({ success: true, message: "Already in wishlist" });
    }

    wishlist.courses.push(courseId);
    await wishlist.save();

    res.json({ success: true, message: "Course added to wishlist" });
  } catch (err) {
    console.error("❌ Wishlist add error:", err);
    res.status(500).json({ success: false, message: "Wishlist action failed" });
  }
});

// ✅ Remove course from wishlist
router.delete("/remove/:courseId", authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist || !wishlist.courses.includes(courseId)) {
      return res.json({ success: true, message: "Not in wishlist" });
    }

    wishlist.courses = wishlist.courses.filter((id) => id.toString() !== courseId);
    await wishlist.save();

    res.json({ success: true, message: "Course removed from wishlist" });
  } catch (err) {
    console.error("❌ Wishlist remove error:", err);
    res.status(500).json({ success: false, message: "Wishlist action failed" });
  }
});

export default router;
