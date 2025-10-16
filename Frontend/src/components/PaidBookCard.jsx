import React from "react";

export default function PaidBookCard({ book, onBuyOrRead, isPurchased, isProcessing }) {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-md 
      hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all duration-300 
      w-full sm:w-60 mx-auto hover:-translate-y-1 flex flex-col justify-between
      bg-white dark:bg-[#0f172a]"
    >
      {/* ✅ Full image visible */}
      <div className="w-full aspect-[2/3] overflow-hidden flex items-center justify-center bg-gradient-to-b from-gray-200 to-gray-100 dark:from-black dark:to-[#0f172a]">
        <img
          src={book.coverImage || book.cover || "/fallback-cover.jpg"}
          alt={book.title}
          className="w-full h-full object-contain"
          onError={(e) => (e.target.src = "/no-cover.png")}
        />
      </div>

      {/* Book Info */}
      <div className="p-4 text-center flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-gray-900 dark:text-white font-semibold text-base sm:text-lg truncate mb-1">
            {book.title}
          </h3>
          {book.author && (
            <p className="text-gray-500 dark:text-gray-400 text-sm truncate mb-2">{book.author}</p>
          )}
        </div>

        <p className="font-semibold text-purple-600 dark:text-purple-400 mb-4 text-sm sm:text-base">
          ₹{book.price || "—"}
        </p>

        {/* Buy / Read Button */}
        <button
          onClick={() => !isProcessing && onBuyOrRead(book)}
          disabled={isProcessing}
          className={`w-full py-2 rounded-xl font-semibold text-white text-sm sm:text-base transition-all 
            ${
              isProcessing
                ? "bg-gray-400 dark:bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:brightness-110"
            } shadow-md`}
        >
          {isProcessing ? "Processing..." : isPurchased ? "Read" : "Buy"}
        </button>
      </div>
    </div>
  );
}
