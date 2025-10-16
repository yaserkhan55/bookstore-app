// seedBooks.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "./models/Book.js"; // make sure this path is correct

dotenv.config();

const books = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "An easy & proven way to build good habits and break bad ones.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51-nXsSRfZL._SX329_BO1,204,203,200_.jpg",
    price: 15.99,
    fileUrl: ""
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "A Handbook of Agile Software Craftsmanship.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX374_BO1,204,203,200_.jpg",
    price: 29.99,
    fileUrl: ""
  },
  {
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    description: "A modern introduction to programming in JavaScript.",
    coverImage: "https://eloquentjavascript.net/img/cover.jpg",
    price: 0,
    fileUrl: ""
  },
  {
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    description: "From Journeyman to Master, practical programming guidance.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/41as+WafrFL._SX258_BO1,204,203,200_.jpg",
    price: 35.0,
    fileUrl: ""
  },
  {
    title: "You Don't Know JS Yet",
    author: "Kyle Simpson",
    description: "Deep dive into JavaScript concepts.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/41U0JqzL1-L._SX218_BO1,204,203,200_QL40_FMwebp_.jpg",
    price: 0,
    fileUrl: ""
  }
];

const seed = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Clearing existing books...");
    await Book.deleteMany();

    console.log("Seeding new books...");
    await Book.insertMany(books);

    console.log("✅ Books seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding books:", err);
    process.exit(1);
  }
};

seed();
