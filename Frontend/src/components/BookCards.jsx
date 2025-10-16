import React, { useState, useEffect } from "react";

export default function BookCards() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all books
  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  // Handle search input
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = books.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        (b.author && b.author.toLowerCase().includes(query))
    );
    setFilteredBooks(filtered);
  }, [searchQuery, books]);

  // Read full book
  const readBook = (book) => {
    fetch(`http://localhost:5000/api/books/read/${book._id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedBook({ ...data, _id: book._id, file: book.file });
        window.scrollTo({ top: 0, behavior: "auto" });
      })
      .catch((err) => console.error("Error reading book:", err));
  };

  const backToList = () => setSelectedBook(null);

  const getCoverUrl = (cover) =>
    cover?.startsWith("http")
      ? cover
      : cover
      ? `http://localhost:5000${cover}`
      : "/no-cover.png";

  const scrollToChapter = (anchorId) => {
    const el = document.getElementById(anchorId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {!selectedBook ? (
        <>
          {/* 🔍 Search Bar */}
          <div className="mb-6 sm:mb-8 px-4 sm:px-0 flex justify-center">
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md px-4 py-3 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm sm:text-base"
            />
          </div>

          {/* 📚 Library Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-0">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-slate-900 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-pink-500/30 border border-transparent hover:border-pink-500/40"
              >
                <div className="w-full aspect-[3/4] overflow-hidden">
                  <img
                    src={getCoverUrl(book.cover)}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "/no-cover.png")}
                  />
                </div>
                <div className="p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                      {book.title}
                    </h3>
                    {book.author && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
                        {book.author}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => readBook(book)}
                    className="mt-4 w-full py-3 sm:py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:brightness-110 shadow-md transition-all text-sm sm:text-base"
                  >
                    Read
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // 📖 Reader View
        <div className="max-w-5xl mx-auto relative flex flex-col lg:flex-row">
          {/* 📑 Floating Table of Contents (Desktop Only) */}
          {selectedBook.chapters?.length > 1 && (
            <aside className="hidden lg:block sticky top-28 left-0 h-[75vh] w-60 mr-8 overflow-y-auto rounded-xl shadow-md bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200/40 dark:border-gray-700/40 p-4 text-sm">
              <h3 className="text-base font-semibold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-3 border-b border-gray-300/40 pb-1">
                Contents
              </h3>
              <ul className="space-y-2">
                {selectedBook.chapters.map((ch, i) => (
                  <li key={i}>
                    <button
                      onClick={() => scrollToChapter(ch.anchorId)}
                      className="text-left text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-all text-sm sm:text-base w-full"
                    >
                      {ch.title.length > 40
                        ? ch.title.slice(0, 40) + "..."
                        : ch.title}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          {/* Mobile Table of Contents */}
          {selectedBook.chapters?.length > 1 && (
            <aside className="lg:hidden mb-4 p-4 rounded-xl shadow-md bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200/40 dark:border-gray-700/40">
              <h3 className="text-base font-semibold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-3 border-b border-gray-300/40 pb-1">
                Contents
              </h3>
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {selectedBook.chapters.map((ch, i) => (
                  <li key={i}>
                    <button
                      onClick={() => scrollToChapter(ch.anchorId)}
                      className="text-left text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-all w-full"
                    >
                      {ch.title.length > 40
                        ? ch.title.slice(0, 40) + "..."
                        : ch.title}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          {/* Main Book Content */}
          <div className="flex-1 px-4 sm:px-0">
            {/* Top Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-3">
              <button
                onClick={backToList}
                className="px-6 py-3 sm:py-2 rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 hover:brightness-110 shadow-md transition-all text-sm sm:text-base"
              >
                ← Back to Library
              </button>

              {selectedBook.file && (
                <a
                  href={`http://localhost:5000/api/books/download/${selectedBook._id}`}
                  className="px-6 py-3 sm:py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:brightness-110 shadow-md transition-all text-sm sm:text-base"
                >
                  📥 Download
                </a>
              )}
            </div>

            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
              <img
                src={getCoverUrl(selectedBook.cover)}
                alt={selectedBook.title}
                className="w-60 sm:w-72 h-80 sm:h-96 object-cover shadow-2xl rounded-xl mb-6"
                onError={(e) => (e.target.src = "/no-cover.png")}
              />
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2 tracking-tight">
                {selectedBook.title}
              </h1>
              {selectedBook.author && (
                <h4 className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 italic mt-2">
                  {selectedBook.author}
                </h4>
              )}
            </div>

            {/* Book Text */}
            <div
              className="prose dark:prose-invert max-w-none px-2 sm:px-10 py-8 sm:py-10 rounded-2xl shadow-inner bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-sm sm:text-base"
              style={{
                direction:
                  selectedBook.title === "Bagh-o-Bahar" ? "rtl" : "ltr",
                fontFamily:
                  selectedBook.title === "Bagh-o-Bahar"
                    ? "'Noto Nastaliq Urdu', 'Noto Sans Arabic', serif"
                    : "'Merriweather', Georgia, serif",
                lineHeight: selectedBook.title === "Bagh-o-Bahar" ? 2.2 : 1.9,
                textAlign:
                  selectedBook.title === "Bagh-o-Bahar" ? "right" : "justify",
                fontSize: selectedBook.title === "Bagh-o-Bahar" ? "1.2rem" : "1rem",
              }}
            >
              {selectedBook.blocks?.map((block, idx) => {
                if (block.type === "chapter") {
                  return (
                    <h2
                      key={idx}
                      id={block.anchorId}
                      className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-gray-100 mt-10 sm:mt-14 mb-4 sm:mb-6 tracking-tight border-b border-gray-300/50 pb-2 scroll-mt-24"
                    >
                      {block.title}
                    </h2>
                  );
                }
                if (block.type === "paragraph") {
                  return (
                    <p key={idx} className="mb-4 sm:mb-6 text-gray-800 dark:text-gray-200">
                      {block.text}
                    </p>
                  );
                }
                if (block.type === "image") {
                  return (
                    <img
                      key={idx}
                      src={block.url}
                      alt=""
                      className="my-4 sm:my-8 mx-auto rounded-lg shadow-lg max-h-[300px] sm:max-h-[500px] w-full sm:w-auto object-contain"
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
