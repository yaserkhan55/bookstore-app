import React from "react";
import { Link } from "react-router-dom";

export default function Card({ item, enrolled, handleEnroll }) {
  const itemId = String(item._id);
  const isEnrolled = enrolled.includes(itemId);

  const imageSrc = item.image || "https://via.placeholder.com/400x250.png?text=Item";

  return (
    <div className="bg-gradient-to-tr from-white via-pink-50 to-purple-50 dark:from-slate-800 dark:via-slate-900 dark:to-gray-900 shadow-lg rounded-2xl overflow-hidden flex flex-col justify-between border border-gray-200 dark:border-gray-700">
      <img src={imageSrc} alt={item.title || "Item"} className="h-48 w-full object-cover" />

      <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
          <p className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
            ${item.price}
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => handleEnroll(itemId, item.title, "book")}
            className={`w-full py-2 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 transform ${
              isEnrolled
                ? "bg-green-500 hover:bg-green-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 active:scale-95"
            }`}
          >
            {isEnrolled ? "✅ Enrolled" : "Enroll Now"}
          </button>

          <Link
            to={`/courses/${itemId}`}
            className="w-full px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition inline-block text-center"
          >
            Course Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
