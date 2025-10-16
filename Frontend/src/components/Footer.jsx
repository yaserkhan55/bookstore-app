import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-gray-300 py-8 mt-12 shadow-inner transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand */}
        <p className="text-sm md:text-base">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-pink-500">Bookstore</span>. All rights reserved.
        </p>

        {/* Right: Links */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-sm md:text-base font-medium">
          <Link
            to="/about"
            className="hover:text-pink-500 transition"
          >
            ℹ️ About
          </Link>
          <Link
            to="/contact"
            className="hover:text-pink-500 transition"
          >
            📩 Contact
          </Link>
          <Link
            to="/course"
            className="hover:text-pink-500 transition"
          >
            📚 Courses
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 dark:border-slate-700 mt-6 pt-4 text-center text-xs md:text-sm text-gray-600 dark:text-gray-400">
        Built with ❤️ using React & Tailwind
      </div>
    </footer>
  );
}
