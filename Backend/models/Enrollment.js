import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },   // "test-user" or a real userId
  courseId: { type: String, required: true }, // stores slug like "react-beginners"
  enrolledAt: { type: Date, default: Date.now },
});

// prevent duplicate enrollment
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;
