// seedCourse.js
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// --- Helpers to build absolute path ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Import Models ---
const courseModelPath = path.resolve(__dirname, "./model/course.model.js");
const courseModelUrl = new URL(`file://${courseModelPath}`);
const { default: Course } = await import(courseModelUrl);

const progressModelPath = path.resolve(__dirname, "./model/progress.model.js");
const progressModelUrl = new URL(`file://${progressModelPath}`);
const { default: Progress } = await import(progressModelUrl);

// --- MongoDB URI ---
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://zk271278:khan33358@cluster0.brshigm.mongodb.net/books";

// --- User ID to seed progress for ---
const userId = "64f8c2a1aa9c6302c2bfb262"; // replace with your actual userId

// --- Courses Data ---
const courses = [
  {
    _id: new mongoose.Types.ObjectId("64fa1234567890abcdef1234"), // courseId
    title: "React for Beginners",
    description: "Learn React fundamentals, hooks, and state management to build modern UIs.",
    price: 59,
    image: "https://www.acesoftech.com/wp-content/themes/acesoftech/assets/img_2025/ReactJS%20Banner.webp",
    category: "Frontend",
    lessons: ["lesson1","lesson2","lesson3","lesson4","lesson5","lesson6"],
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  },
  {
    title: "Node.js & Express Bootcamp",
    description: "Backend development with APIs, authentication & deployment to cloud.",
    price: 79,
  },
  {
    title: "Full-Stack MERN Development",
    description: "Combine MongoDB, Express, React, and Node to build scalable apps.",
    price: 99,
  },
];

// --- Seed Function ---
async function seedCoursesAndProgress() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Insert courses
    await Course.insertMany(courses, { ordered: false });
    console.log("🎉 Courses seeded successfully");

    // Seed progress for first course
    const progressData = {
      userId,
      courseId: "64fa1234567890abcdef1234",
      completedLessons: ["lesson1","lesson3"], // 33% progress
    };

    await Progress.updateOne(
      { userId: progressData.userId, courseId: progressData.courseId },
      { $set: progressData },
      { upsert: true }
    );
    console.log("🎯 User progress seeded successfully");

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    mongoose.disconnect();
  }
}

seedCoursesAndProgress();
