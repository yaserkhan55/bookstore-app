import express from "express";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.model.js";

const router = express.Router();

// ✅ Enroll in a course
router.post("/:id/enroll", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ success: false, message: "User ID required" });

    // prevent duplicate
    const exists = await Enrollment.findOne({ userId, courseId: id });
    if (exists) return res.status(400).json({ success: false, message: "Already enrolled" });

    const enrollment = new Enrollment({ userId, courseId: id });
    await enrollment.save();

    console.log(`✅ User ${userId} ENROLLED in course ${id}`);

    res.status(201).json({ success: true, message: "Enrolled successfully", enrollment });
  } catch (err) {
    console.error("❌ Enroll error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Cancel enrollment
router.delete("/:id/enroll", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const enrollment = await Enrollment.findOneAndDelete({ userId, courseId: id });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    console.log(`❌ User ${userId} CANCELLED enrollment for course ${id}`);

    res.json({ success: true, message: "Enrollment cancelled" });
  } catch (err) {
    console.error("❌ Cancel enroll error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
