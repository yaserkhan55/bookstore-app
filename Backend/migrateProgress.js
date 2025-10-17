// migrateProgress.js
import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://zk271278:khan33358@cluster0.brshigm.mongodb.net/books";

// Define a minimal Progress schema just for migration
const progressSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  courseId: mongoose.Schema.Types.ObjectId,
  completedLessons: [mongoose.Schema.Types.Mixed], // Mixed to handle both ObjectId & String
  progress: Number,
});

const Progress = mongoose.model("Progress", progressSchema, "progresses");

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const progresses = await Progress.find({});
    console.log(`📌 Found ${progresses.length} progress documents`);

    for (let doc of progresses) {
      let updated = false;

      const newCompleted = doc.completedLessons.map((lesson) => {
        if (typeof lesson !== "string") {
          updated = true;
          return lesson.toString(); // convert ObjectId -> string
        }
        return lesson;
      });

      if (updated) {
        doc.completedLessons = newCompleted;
        await doc.save();
        console.log(`🔄 Updated progress ${doc._id}`);
      }
    }

    console.log("🎉 Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration error:", err);
    process.exit(1);
  }
}

migrate();
