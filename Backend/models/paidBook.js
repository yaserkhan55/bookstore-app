// Backend/models/PaidBook.js
import mongoose from "mongoose";

const paidBookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  cover: { type: String }, // ✅ matches your DB field
  file: { type: String }, // ✅ matches your DB field
  price: { type: Number, required: true },
  isFree: { type: Boolean, default: false }, // ✅ included for completeness
}, {
  timestamps: true,
});

// ✅ Use explicit collection name (your Mongo collection is "paidbooks")
const PaidBook = mongoose.models.PaidBook || mongoose.model("PaidBook", paidBookSchema, "paidbooks");

export default PaidBook;
