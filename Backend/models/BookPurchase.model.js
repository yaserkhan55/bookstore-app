import mongoose from "mongoose";

const bookPurchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ prevent model overwrite errors in hot reload environments
const BookPurchase =
  mongoose.models.BookPurchase ||
  mongoose.model("BookPurchase", bookPurchaseSchema);

export default BookPurchase;
