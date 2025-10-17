// backend/models/PaidBook.js
import mongoose from "mongoose";

const paidBookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  coverImage: String,
  category: String,
  price: Number,
  fileUrl: String,
});

// Third param is the collection name
const PaidBook = mongoose.models.PaidBook || mongoose.model("PaidBook", paidBookSchema, "paidbooks");

export default PaidBook;
