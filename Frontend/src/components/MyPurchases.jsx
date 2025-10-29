// src/pages/PurchasedBooks.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PurchasedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPurchasedBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/purchases/my", {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        });
        if (res.data.success && Array.isArray(res.data.books)) {
          setBooks(res.data.books);
        }
      } catch (err) {
        console.error("💥 Error fetching purchased books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchasedBooks();
  }, [token]);

  if (loading)
    return (
      <p className="text-center mt-24 text-xl text-gray-700 dark:text-gray-300">
        ⏳ Loading purchased books...
      </p>
    );

  if (books.length === 0)
    return (
      <p className="text-center mt-24 text-xl text-gray-700 dark:text-gray-300">
        😕 You haven’t purchased any books yet.
      </p>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors pt-28 pb-16 px-6">
      <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
        📚 Your Purchased Books
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {books.map((book) => (
          <div
            key={book._id}
            onClick={() => navigate(`/paid-books/read/${book._id}`)}
            className="relative group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] border border-gray-100 dark:border-slate-700 transition-all duration-500"
          >
            {/* ✅ Purchased Ribbon */}
            <div className="absolute top-3 right-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">
              ✅ Purchased
            </div>

            {/* Cover */}
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Info */}
            <div className="p-4 text-center">
              <h3 className="text-gray-900 dark:text-white font-semibold text-base sm:text-lg truncate mb-1">
                {book.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm truncate mb-2">
                {book.author}
              </p>
              <p className="text-green-600 dark:text-green-400 font-semibold">
                ₹{book.price}
              </p>
              <button
                className="w-full mt-3 py-2 rounded-xl font-semibold text-white text-sm sm:text-base 
                  bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:brightness-110 transition-all shadow-md"
              >
                Read
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
