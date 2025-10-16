// normalizePaidBooks.js
import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/yourDatabaseName"; // replace with your DB

const bookSchema = new mongoose.Schema({}, { strict: false });
const Book = mongoose.model("Book", bookSchema, "books"); // collection name: books

async function normalizePaidBooks() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const paidBooks = await Book.find({ isFree: false });
    console.log(`Found ${paidBooks.length} paid books`);

    for (const book of paidBooks) {
      let updated = false;

      // 1️⃣ Convert _id to string if it's ObjectId
      if (typeof book._id !== "string") {
        book._id = book._id.valueOf();
        updated = true;
      }

      // 2️⃣ Rename image -> coverImage if exists
      if (book.image) {
        book.coverImage = book.image;
        delete book.image;
        updated = true;
      }

      // 3️⃣ Ensure isFree field exists
      if (book.isFree === undefined) {
        book.isFree = false;
        updated = true;
      }

      // 4️⃣ Ensure fileUrl exists (optional)
      if (!book.fileUrl) {
        book.fileUrl = ""; // leave empty if no single file
        updated = true;
      }

      // Save changes only if something changed
      if (updated) {
        await book.save();
        console.log(`✅ Normalized book: ${book.title}`);
      } else {
        console.log(`⏩ No changes needed for: ${book.title}`);
      }
    }

    console.log("All paid books normalized successfully!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Migration error:", err);
    await mongoose.disconnect();
  }
}

normalizePaidBooks();
