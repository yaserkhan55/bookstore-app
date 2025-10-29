// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaMoneyBillWave } from "react-icons/fa";

const BASE_URL = "http://localhost:5000/api/dashboard";

export default function Dashboard() {
  const [totalPurchases, setTotalPurchases] = useState(0);
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
          setTotalPurchases(res.data.data.totalPurchases || 0);
        } else {
          setError(res.data.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        console.error("💥 Dashboard error:", err);
        setError("Error fetching dashboard data");
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
      <div className="max-w-4xl mx-auto space-y-16">
        <h2 className="text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          📊 Dashboard Overview
        </h2>

        {/* 🛍️ Only Purchased Books */}
        <div className="grid grid-cols-1 gap-10">
          <div
            className="group relative overflow-hidden p-10 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-transparent hover:border-green-400/40 transition-all duration-500 cursor-pointer"
            onClick={() => navigate("/purchases")}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-green-500/20 via-teal-500/10 to-transparent blur-2xl transition-all duration-500" />
            <div className="relative flex items-center gap-3 mb-3 text-green-600 dark:text-green-400">
              <FaMoneyBillWave size={30} />
              <span className="font-semibold text-xl">Purchased Books</span>
            </div>
            <p className="relative text-4xl font-extrabold text-gray-900 dark:text-white">
              {totalPurchases}
            </p>
          </div>
        </div>

        <div className="text-center mt-16 text-gray-500 dark:text-gray-400 text-sm">
          You’ve purchased {totalPurchases} {totalPurchases === 1 ? "book" : "books"} so far 🚀
        </div>
      </div>
    </div>
  );
}
