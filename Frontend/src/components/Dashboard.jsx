// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBook, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";

const BASE_URL = "http://localhost:5000/api/dashboard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalPaidBooks: 0,
    totalPurchases: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(BASE_URL, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        });

        if (res.data.success && res.data.data) {
          const data = res.data.data;
          setStats({
            totalBooks: data.totalBooks || 0,
            totalPaidBooks: data.totalPaidBooks || 0,
            totalPurchases: data.totalPurchases || 0, // ✅ Added total purchases
          });
        } else {
          setError(res.data.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("Error fetching dashboard data");
        console.error("💥 Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  if (loading)
    return <p className="text-center mt-24 text-xl">⏳ Loading dashboard...</p>;

  if (error)
    return (
      <p className="text-center mt-24 text-red-500 text-xl break-words px-4">
        ⚠️ {error}
      </p>
    );

  return (
    <div className="px-6 pt-28 pb-16 min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto space-y-16">
        <h2 className="text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          📊 Dashboard Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* 🛍️ Purchased Books */}
          <div
            className="group relative overflow-hidden p-10 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-transparent hover:border-green-400/40 transition-all duration-500 cursor-pointer"
            onClick={() => navigate("/purchases")} // ✅ Redirect to Purchased Books page
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-green-500/20 via-teal-500/10 to-transparent blur-2xl transition-all duration-500" />
            <div className="relative flex items-center gap-3 mb-3 text-green-600 dark:text-green-400">
              <FaMoneyBillWave size={30} />
              <span className="font-semibold text-xl">Purchased Books</span>
            </div>
            <p className="relative text-4xl font-extrabold text-gray-900 dark:text-white">
              {stats.totalPurchases}
            </p>
          </div>

          {/* 📚 Free Books */}
          <div
            className="group relative overflow-hidden p-10 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-transparent hover:border-purple-400/40 transition-all duration-500 cursor-pointer"
            onClick={() => navigate("/books")}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-500/20 via-indigo-500/10 to-transparent blur-2xl transition-all duration-500" />
            <div className="relative flex items-center gap-3 mb-3 text-purple-600 dark:text-purple-400">
              <FaBook size={28} />
              <span className="font-semibold text-xl">Free Books</span>
            </div>
            <p className="relative text-4xl font-extrabold text-gray-900 dark:text-white">
              {stats.totalBooks - stats.totalPaidBooks}
            </p>
          </div>

          {/* 💰 Paid Books */}
          <div
            className={`group relative overflow-hidden p-10 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border transition-all duration-500 cursor-pointer ${
              stats.totalPaidBooks > 0
                ? "border-transparent hover:border-indigo-400/60 animate-glow"
                : "border-transparent hover:border-indigo-300/30"
            }`}
            onClick={() => navigate("/paid-books")}
          >
            {stats.totalPaidBooks > 0 && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-pink-500/10 to-transparent blur-2xl opacity-100 animate-pulse" />
                <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  💰 Paid
                </div>
              </>
            )}

            <div className="relative flex items-center gap-3 mb-3 text-indigo-600 dark:text-indigo-400">
              <FaShoppingCart size={28} />
              <span className="font-semibold text-xl">Paid Books</span>
            </div>
            <p className="relative text-4xl font-extrabold text-gray-900 dark:text-white">
              {stats.totalPaidBooks}
            </p>
          </div>
        </div>

        <div className="text-center mt-16 text-gray-500 dark:text-gray-400 text-sm">
          Add more paid books to grow your bookstore 🚀
        </div>
      </div>
    </div>
  );
}
