import express from "express";
import PaidBook from "../models/PaidBook.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Test route
router.get("/test", (req, res) => {
  console.log("🟢 PaidBook test route hit");
  res.json({ message: "PaidBook route working" });
});

// 🟣 Get all paid books
router.get("/", async (req, res) => {
  try {
    console.log("🟣 Fetching all paid books");
    const books = await PaidBook.find({}).lean();
    res.json(books);
  } catch (err) {
    console.error("💥 Error fetching paid books:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟣 Get single paid book with chapters
router.get("/read/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🟣 Read request for book ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await PaidBook.findById(id).lean();
    if (!book) return res.status(404).json({ message: "Book not found" });

    let content = book.text || "";

    // ✅ Load from file if text missing
    if (!content && book.file) {
      const filePath = path.join(__dirname, "..", "books", path.basename(book.file));
      console.log("📘 Reading file:", filePath);
      if (fs.existsSync(filePath)) {
        content = fs.readFileSync(filePath, "utf8");
        console.log("✅ File read successfully");
      } else {
        return res.status(404).json({ message: "Book file not found" });
      }
    }

    if (!content) return res.status(404).json({ message: "Book text missing" });

    // 🔹 Split text into chapters
    const chapterRegex = /(CHAPTER\s+[IVXLCDM0-9]+\s*\.?.*?)\r?\n/gi;
    const parts = content.split(chapterRegex).filter(Boolean);

    const blocks = [];
    const chapters = [];

    let currentChapter = { title: "Introduction", anchorId: "chapter-0" };
    chapters.push(currentChapter);

    let blockId = 0;
    for (let i = 0; i < parts.length; i++) {
      const text = parts[i].trim();
      if (text.toUpperCase().startsWith("CHAPTER")) {
        // New chapter detected
        currentChapter = { title: text, anchorId: `chapter-${chapters.length}` };
        chapters.push(currentChapter);
        blocks.push({ type: "chapter", title: text, anchorId: currentChapter.anchorId, id: blockId++ });
      } else {
        // Paragraphs
        const paragraphs = text
          .split(/\r?\n\r?\n+/)
          .map((p) => p.replace(/\r?\n/g, " ").trim())
          .filter(Boolean);
        paragraphs.forEach((p) => blocks.push({ type: "paragraph", text: p, id: blockId++ }));
      }
    }

    console.log(`✅ Returning ${blocks.length} blocks with ${chapters.length} chapters`);

    res.json({
      _id: book._id,
      title: book.title,
      author: book.author,
      cover: book.cover,
      price: book.price,
      isFree: false,
      blocks,
      chapters,
    });
  } catch (err) {
    console.error("💥 Error in read route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
