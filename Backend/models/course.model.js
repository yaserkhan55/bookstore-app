// backend/models/course.model.js
import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const codingExerciseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  starterCode: { type: String },
  instructions: { type: String, required: true },
});

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  resources: [{ type: String }],
});

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, default: null },
    quizzes: [quizSchema],
    codingExercises: [codingExerciseSchema],
    assignments: [assignmentSchema],
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    instructor: String,
    price: Number,
    image: String,
    category: String,
    lessons: [lessonSchema],

    // ✅ Add this field for enrollment tracking
    enrolledUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", courseSchema);
