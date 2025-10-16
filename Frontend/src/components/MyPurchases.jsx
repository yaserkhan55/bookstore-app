import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/bookpurchases/my";

export default function MyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get(BASE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setPurchases(res.data.data);
        }
      } catch (err) {
        console.error("❌ Error fetching purchases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [token]);

  if (loading) return <p className="text-center mt-24">⏳ Loading purchases...</p>;

  if (purchases.length === 0)
    return (
      <p className="text-center mt-24 text-lg text-gray-600">
        😕 You haven’t purchased any books yet.
      </p>
    );

  return (
    <div className="pt-28 pb-16 px-6 min-h-screen bg-gray-50 dark:bg-slate-900">
      <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">
        📚 Your Purchased Books
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {purchases.map((purchase) => (
          <div
            key={purchase._id}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
          >
            <img
              src={purchase.bookId?.coverImage || "/default-cover.jpg"}
              alt={purchase.bookId?.title}
              className="w-full h-64 object-cover rounded-xl mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {purchase.bookId?.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              by {purchase.bookId?.author}
            </p>
            <p className="text-green-600 dark:text-green-400 font-semibold mt-2">
              ₹{purchase.bookId?.price}
            </p>
            <p className="text-sm text-gray-400 mt-3">
              Purchased on: {new Date(purchase.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
