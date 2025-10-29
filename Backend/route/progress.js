import express from "express";
import Course from "../models/course.model.js";
import Progress from "../models/progress.model.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Get user progress for a course
router.get("/:courseId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    let progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      // Auto-create progress if not found
      progress = new Progress({ userId, courseId, completedLessons: [], progress: 0 });
      await progress.save();
    }

    res.json({
      completedLessons: progress.completedLessons || [],
      progress: progress.progress || 0,
      completedAt: progress.completedAt || null,
    });
  } catch (err) {
    console.error("❌ Failed to fetch progress:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark lesson complete
router.post("/:courseId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    const { lessonId, totalLessons } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    let progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      progress = new Progress({ userId, courseId, completedLessons: [], progress: 0 });
    }

    if (lessonId && !progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    // Calculate progress percentage
    const total =
      totalLessons || course.modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
    progress.progress = Math.round((progress.completedLessons.length / total) * 100);

    // ✅ NEW: If 100% completed, set timestamp (only once)
    if (progress.progress === 100 && !progress.completedAt) {
      progress.completedAt = new Date();
    }

    await progress.save();

    res.json({
      completedLessons: progress.completedLessons,
      progress: progress.progress,
      completedAt: progress.completedAt || null,
    });
  } catch (err) {
    console.error("❌ Failed to mark lesson complete:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
