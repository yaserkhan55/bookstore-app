// // autoUpdateCoursesAndProgress.js
// import mongoose from "mongoose";

// // MongoDB connection URI
// const MONGO_URI = "mongodb+srv://zk271278:khan33358@cluster0.brshigm.mongodb.net/books";

// // Schemas
// const courseSchema = new mongoose.Schema(
//   {
//     title: String,
//     description: String,
//     instructor: String,
//     price: Number,
//     image: String,
//     modules: [
//       {
//         title: String,
//         lessons: [
//           {
//             _id: String,
//             title: String,
//             type: { type: String, enum: ["video", "text"], default: "text" },
//             content: String,
//             contentUrl: String,
//           },
//         ],
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const progressSchema = new mongoose.Schema({
//   userId: String,
//   courseId: String,
//   completedLessons: [String],
//   progress: Number,
// });

// const userSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   // add other fields as needed
// });

// // Models
// const Course = mongoose.model("Course", courseSchema);
// const Progress = mongoose.model("Progress", progressSchema);
// const User = mongoose.model("User", userSchema);

// async function autoUpdateCoursesAndProgress() {
//   await mongoose.connect(MONGO_URI);
//   console.log("✅ Connected to MongoDB");

//   const courses = await Course.find();
//   const users = await User.find(); // dynamically fetch all users

//   for (const course of courses) {
//     let updatedCourse = false;

//     // Ensure at least one module exists
//     if (!course.modules || course.modules.length === 0) {
//       course.modules = [
//         {
//           title: "Module 1",
//           lessons: [
//             {
//               _id: new mongoose.Types.ObjectId().toString(),
//               title: "Lesson 1",
//               type: "video",
//               content: "Lesson 1 content",
//               contentUrl: "https://via.placeholder.com/300x200?text=Lesson+1",
//             },
//             {
//               _id: new mongoose.Types.ObjectId().toString(),
//               title: "Lesson 2",
//               type: "text",
//               content: "Lesson 2 content",
//               contentUrl: "",
//             },
//           ],
//         },
//       ];
//       updatedCourse = true;
//     }

//     // Ensure all lessons have unique _id
//     for (const mod of course.modules) {
//       for (const lesson of mod.lessons) {
//         if (!lesson._id) lesson._id = new mongoose.Types.ObjectId().toString();
//       }
//     }

//     if (updatedCourse) {
//       await course.save();
//       console.log(`✅ Updated course: ${course.title}`);
//     }

//     // Ensure every user has a Progress document for this course
//     for (const user of users) {
//       const progressDoc = await Progress.findOne({ userId: user._id.toString(), courseId: course._id.toString() });

//       if (!progressDoc) {
//         const newProgress = new Progress({
//           userId: user._id.toString(),
//           courseId: course._id.toString(),
//           completedLessons: [],
//           progress: 0,
//         });
//         await newProgress.save();
//         console.log(`🆕 Created progress for user ${user.username} in course ${course.title}`);
//       }
//     }

//     // Update all progress documents for this course
//     const progressDocs = await Progress.find({ courseId: course._id.toString() });
//     const totalLessons = course.modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);

//     for (const prog of progressDocs) {
//       const completedCount = prog.completedLessons.length;
//       prog.progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
//       await prog.save();
//       console.log(`✅ Updated progress for user ${prog.userId} in course ${course.title}: ${prog.progress}%`);
//     }
//   }

//   console.log("🎉 All courses and progress updated automatically!");
//   await mongoose.disconnect();
// }

// // Run the automation
// autoUpdateCoursesAndProgress().catch((err) => {
//   console.error("❌ Error during automated update:", err);
//   process.exit(1);
// });
