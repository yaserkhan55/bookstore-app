import express from "express";
import Course from "../models/course.model.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error("❌ Failed to fetch courses:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single course
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    console.error("❌ Failed to fetch course:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ENROLL user in course
router.post("/:id/enroll", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.enrolledUsers?.includes(req.user.id)) {
      return res.json({ message: "Already enrolled", course });
    }

    if (!Array.isArray(course.enrolledUsers)) course.enrolledUsers = [];
    course.enrolledUsers.push(req.user.id);
    await course.save();

    res.json({ message: "Enrolled successfully", course });
  } catch (err) {
    console.error("❌ Enroll error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// CANCEL ENROLLMENT
router.post("/:id/cancel-enroll", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.enrolledUsers = (course.enrolledUsers || []).filter(
      (id) => id.toString() !== req.user.id.toString()
    );
    await course.save();

    res.json({ message: "Enrollment cancelled", course });
  } catch (err) {
    console.error("❌ Cancel enroll error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET progress
router.get("/:id/progress", authMiddleware, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.json({ completedLessons: [], progress: 0 });
    }

    const userProgress = course.progress?.find(
      (p) => p.user.toString() === userId
    );

    res.json({
      completedLessons: userProgress?.completedLessons || [],
      progress: userProgress?.progress || 0,
    });
  } catch (err) {
    console.error("❌ Fetch progress error:", err.message);
    res.status(500).json({ completedLessons: [], progress: 0 });
  }
});

// POST progress
router.post("/:id/progress", authMiddleware, async (req, res) => {
  try {
    const { lessonId, totalLessons } = req.body || {};
    const courseId = req.params.id;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.json({ completedLessons: lessonId ? [lessonId] : [], progress: 0 });
    }

    if (!Array.isArray(course.progress)) course.progress = [];

    let userProgress = course.progress.find((p) => p.user.toString() === userId);
    if (!userProgress) {
      userProgress = { user: userId, completedLessons: [], progress: 0 };
      course.progress.push(userProgress);
    }

    if (lessonId && !userProgress.completedLessons.includes(lessonId)) {
      userProgress.completedLessons.push(lessonId);
    }

    userProgress.progress = totalLessons
      ? Math.round((userProgress.completedLessons.length / totalLessons) * 100)
      : 0;

    await course.save();

    res.json({
      completedLessons: userProgress.completedLessons,
      progress: userProgress.progress,
    });
  } catch (err) {
    console.error("❌ Update progress error:", err.message);
    res.status(500).json({ completedLessons: [], progress: 0 });
  }
});

export default router;
