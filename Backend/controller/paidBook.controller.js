// controllers/paidBook.controller.js
import PaidBook from "../models/PaidBook.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📘 Get all paid books
export const getAllPaidBooks = async (req, res) => {
  try {
    const books = await PaidBook.find().lean();
    res.json(books);
  } catch (err) {
    console.error("💥 Error fetching paid books:", err);
    res.status(500).json({ message: "Server error fetching paid books" });
  }
};

// 📖 Read a single paid book (full text)
export const readPaidBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await PaidBook.findById(id).lean();
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // ✅ Prefer text in DB; if empty, read file
    let content = book.text || "";
    if (!content && book.file) {
      const booksDir = path.join(__dirname, "..", "books");
      const filePath = path.join(booksDir, path.basename(book.file));
      if (fs.existsSync(filePath)) {
        content = fs.readFileSync(filePath, "utf8");
      } else {
        return res.status(404).json({ message: "Book file not found" });
      }
    }

    if (!content) {
      return res.status(404).json({ message: "Book text missing" });
    }

    // ✅ Format text into paragraphs
    const paragraphs = content
      .split(/\r?\n\r?\n+/)
      .map((p) => p.replace(/\r?\n/g, " ").trim())
      .filter(Boolean);

    const blocks = paragraphs.map((p, i) => ({
      type: "paragraph",
      text: p,
      id: i,
    }));

    res.json({
      _id: book._id,
      title: book.title,
      author: book.author,
      cover: book.cover,
      price: book.price,
      isFree: false,
      blocks,
    });
  } catch (err) {
    console.error("💥 Error reading paid book:", err);
    res.status(500).json({ message: "Server error" });
  }
};
