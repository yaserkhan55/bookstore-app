// models/Purchase.js
import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "PaidBook", required: true },
  amount: Number,
  razorpay_order_id: String,
  razorpay_payment_id: String,
  status: { type: String, default: "success" },
}, { timestamps: true });

export default mongoose.model("Purchase", purchaseSchema);
