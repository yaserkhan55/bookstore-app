import express from "express";
import Course from "../models/course.model.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Enroll in a course
router.post("/:id", authMiddleware, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (!course.enrolledUsers) course.enrolledUsers = [];
    if (course.enrolledUsers.includes(userId)) 
      return res.json({ success: false, message: "You are already enrolled" });

    course.enrolledUsers.push(userId);
    await course.save();

    res.json({ success: true, message: "Enrolled successfully", course });
  } catch (err) {
    console.error("❌ Enrollment error:", err);
    res.status(500).json({ success: false, message: "Failed to enroll" });
  }
});

// Get all courses the user is enrolled in
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({ enrolledUsers: req.user.id });
    res.json({ success: true, courses });
  } catch (err) {
    console.error("❌ Fetch enrolled courses error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch enrolled courses" });
  }
});

export default router;
