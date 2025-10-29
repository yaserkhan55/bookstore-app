// routes/book.route.js ✅ Handles both local & remote files

import express from "express";
import mongoose from "mongoose";
import Book from "../models/Book.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const makeAnchorId = (title = "") =>
  title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/["“”'’`·•,:;(){}[\]/\\?<>@#%^&*=+~|]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const chapterLineRegex = /^\s*(?:PART\b|CHAPTER\b|[IVXLCDM]+\.\s+)/i;

const getBookById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Book.findById(id);
};

// 📚 Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(
      books.map((b) => ({
        _id: b._id,
        title: b.title,
        author: b.author,
        cover: b.cover,
        isPaid: b.isPaid || false,
        price: b.price || 0,
      }))
    );
  } catch (err) {
    console.error("💥 Error fetching books:", err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// 📖 Read a book (local file or remote URL)
router.get("/read/:id", async (req, res) => {
  try {
    const book = await getBookById(req.params.id);
    if (!book || !book.file)
      return res.status(404).json({ error: "Book not found" });

    let text = "";

    // 🟣 Case 1: Remote file (http/https)
    if (book.file.startsWith("http")) {
      const response = await fetch(book.file);
      if (!response.ok)
        return res.status(404).json({ error: "Failed to fetch remote book file" });
      text = await response.text();
    } else {
      // 🟣 Case 2: Local file (like 'sherlock.txt')
      const filePath = path.join(__dirname, "..", "books", path.basename(book.file));
      console.log("📘 Reading local file:", filePath);
      if (!fs.existsSync(filePath))
        return res.status(404).json({ error: "Book file not found" });
      text = fs.readFileSync(filePath, "utf8");
    }

    // 🧠 Split text into paragraphs & chapters
    const rawParas = text
      .split(/\r?\n\r?\n+/)
      .map((p) => p.replace(/\r?\n/g, " ").trim())
      .filter(Boolean);

    const blocks = [];
    const chapters = [];

    for (const para of rawParas) {
      if (
        chapterLineRegex.test(para) ||
        (para === para.toUpperCase() &&
          para.length < 120 &&
          para.split(/\s+/).length < 12)
      ) {
        const anchorId = makeAnchorId(para);
        blocks.push({ type: "chapter", title: para, anchorId });
        chapters.push({ title: para, anchorId });
      } else {
        blocks.push({ type: "paragraph", text: para });
      }
    }

    res.json({
      _id: book._id,
      title: book.title,
      author: book.author,
      cover: book.cover,
      file: book.file,
      isPaid: book.isPaid || false,
      price: book.price || 0,
      blocks,
      chapters,
    });
  } catch (err) {
    console.error("💥 Error reading book:", err);
    res.status(500).json({ error: "Failed to read book" });
  }
});

export default router;
