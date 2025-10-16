import express from "express";
import Lesson from "../models/Lesson.js";

const router = express.Router();

// GET all lessons
router.get("/", async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single lesson by id
router.get("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create lesson
router.post("/", async (req, res) => {
  try {
    const { title, content, images, courseId } = req.body;
    const lesson = new Lesson({ title, content, images, courseId });
    await lesson.save();
    res.status(201).json(lesson);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
