import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Book from "../models/book.model.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// normalize -> generate safe anchor ids
const makeAnchorId = (title) =>
  title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/["“”'’`·•,:;(){}[\]\/\\?<>@#%^&*=+~|]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// detect chapter headings (robust)
const chapterLineRegex = /^\s*(?:PART\b|CHAPTER\b|[IVXLCDM]+\.\s+)/i;

// Helper: safely fetch book by id (ObjectId or string)
const getBookById = async (id) => {
  let book;
  if (mongoose.Types.ObjectId.isValid(id)) {
    book = await Book.findById(id);
  }
  if (!book) {
    book = await Book.findOne({ _id: id }); // fallback for string IDs
  }
  return book;
};

// 📚 Fetch all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find({});
    const simplifiedBooks = books.map((b) => ({
      _id: b._id,
      title: b.title,
      author: b.author,
      cover: b.cover,
      isPaid: b.isPaid || false,
      price: b.price || 0,
    }));
    res.json(simplifiedBooks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// 📖 Read a book (parse content for modal/inline)
router.get("/read/:id", async (req, res) => {
  try {
    const book = await getBookById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    const safeFile = path.basename(book.file);
    const filePath = path.join(__dirname, "..", "books", safeFile);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Book file not found on server" });
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ error: "Failed to load book file" });
      }

      const rawParas = data
        .split(/\r?\n\r?\n+/)
        .map((p) => p.replace(/\r?\n/g, " ").trim())
        .filter(Boolean);

      const blocks = [];
      const chapters = [];

      for (const para of rawParas) {
        let dbMatch = null;
        if (Array.isArray(book.chapters) && book.chapters.length) {
          dbMatch = book.chapters.find(
            (ch) =>
              ch.title &&
              ch.title.trim().toLowerCase() === para.trim().toLowerCase()
          );
        }

        if (dbMatch) {
          const anchorId = dbMatch.anchorId || makeAnchorId(dbMatch.title);
          blocks.push({ type: "chapter", title: dbMatch.title, anchorId });
          if (!chapters.find((c) => c.anchorId === anchorId)) {
            chapters.push({ title: dbMatch.title, anchorId });
          }
          continue;
        }

        if (
          chapterLineRegex.test(para) ||
          (para === para.toUpperCase() &&
            para.length < 120 &&
            para.split(/\s+/).length < 12)
        ) {
          const anchorId = makeAnchorId(para);
          blocks.push({ type: "chapter", title: para, anchorId });
          if (!chapters.find((c) => c.anchorId === anchorId)) {
            chapters.push({ title: para, anchorId });
          }
        } else if (/^\[image:(.+)\]$/i.test(para)) {
          const match = para.match(/^\[image:(.+)\]$/i);
          blocks.push({ type: "image", url: match[1].trim() });
        } else {
          blocks.push({ type: "paragraph", text: para });
        }
      }

      if (Array.isArray(book.chapters) && book.chapters.length && chapters.length === 0) {
        for (const ch of book.chapters) {
          const anchorId = ch.anchorId || makeAnchorId(ch.title || "");
          chapters.push({ title: ch.title, anchorId });
        }
      }

      const content =
        blocks
          .map((b) =>
            b.type === "paragraph"
              ? `<p>${b.text}</p>`
              : b.type === "chapter"
              ? `<h2>${b.title}</h2>`
              : b.type === "image"
              ? `<img src="${b.url}" alt="image" />`
              : ""
          )
          .join("\n") || "No content available.";

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
        content,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read book" });
  }
});

// 📥 Download book file directly
router.get("/download/:id", async (req, res) => {
  try {
    const book = await getBookById(req.params.id);
    if (!book || !book.file) {
      return res.status(404).json({ error: "Book file not found" });
    }

    const safeFile = path.basename(book.file);
    const filePath = path.join(__dirname, "..", "books", safeFile);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    res.download(filePath, path.basename(book.file));
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Failed to download book" });
  }
});

export default router;
