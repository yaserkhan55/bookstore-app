import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // Markdown/HTML
  images: [{ type: String }], // URLs (Cloudinary, S3, etc.)
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  createdAt: { type: Date, default: Date.now },
});

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
