import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [
      {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
