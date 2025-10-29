import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Book from "../models/Book.model.js";

dotenv.config();

const insertDracula = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Read text file (adjust path if needed)
    const filePath = path.resolve("books/dracula.txt");
    const bookText = fs.readFileSync(filePath, "utf-8");

    // Upsert Dracula book (update if exists, otherwise insert)
    const result = await Book.findOneAndUpdate(
      { title: "Dracula" },
      {
        title: "Dracula",
        author: "Bram Stoker",
        cover:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHlaRwd2Rpl0TwBLk85hMhk1aWoVMDfksCTQ&s",
        file: "dracula.txt",
        text: bookText, // ✅ full text from file
        price: 5,
        isFree: false,
      },
      { upsert: true, new: true }
    );

    console.log("✅ Paid book Dracula inserted/updated:");
    console.log(result);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error inserting Dracula:", err);
  }
};

insertDracula();
