// controllers/enrollmentController.js
import Enrollment from "../models/Enrollment.js";

export const enrollInCourse = async (req, res) => {
  console.log("📥 Incoming enrollment body:", req.body);

  const { userId, courseId } = req.body;

  // 🔒 Safety check before touching DB
  if (!userId || !courseId) {
    console.error("❌ Missing required fields:", { userId, courseId });
    return res.status(400).json({
      success: false,
      message: "userId and courseId are required in the request body",
    });
  }

  try {
    // check if already enrolled
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      console.warn(`⚠️ User ${userId} already enrolled in course ${courseId}`);
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course",
      });
    }

    const enrollment = new Enrollment({ userId, courseId });
    await enrollment.save();

    console.log(`✅ Enrolled user ${userId} in course ${courseId}`);
    res.status(201).json({ success: true, data: enrollment });
  } catch (err) {
    console.error("❌ Enrollment save error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
