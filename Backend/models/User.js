import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  purchasedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

const User = mongoose.model("User", userSchema);
export default User;
