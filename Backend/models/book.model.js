import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  coverImage: String,
  cover: String,
  category: String,
  price: Number,
  isFree: { type: Boolean, default: true },
  downloadUrl: String,
  fileUrl: String,
  file: String,
  text: String,
  chapters: [
    {
      title: String,
      anchorId: String,
    },
  ],
  purchasedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// Prevent model overwrite issues in dev / hot reload
const Book = mongoose.models.Book || mongoose.model("Book", bookSchema, "books");

export default Book;
