import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaidBookCard from "./PaidBookCard";
import { BASE_URL } from "../config";



export default function PaidBooks() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [purchasedBookIds, setPurchasedBookIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingBookId, setProcessingBookId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { bookId } = useParams();

  // 🔹 Fetch Paid Books + User Purchases
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, purchasesRes] = await Promise.all([
          fetch(`${BASE_URL}/api/paidBooks`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/api/book-purchase/my`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!booksRes.ok) throw new Error("Failed to fetch paid books");
        const booksData = await booksRes.json();
        setBooks(booksData);
        setFilteredBooks(booksData);

        if (purchasesRes.ok) {
          const purchasesData = await purchasesRes.json();
          const ids = purchasesData?.purchases?.map((p) => p.book?._id) || [];
          setPurchasedBookIds(ids);
        }
      } catch (err) {
        console.error("💥 Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // 🔹 Auto-open book if /paid-books/:bookId
  useEffect(() => {
    if (bookId && books.length > 0) {
      const foundBook = books.find((b) => b._id === bookId);
      if (foundBook) readBook(foundBook);
    }
  }, [bookId, books]);

  // 🔹 Search filter
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredBooks(
      books.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          (b.author && b.author.toLowerCase().includes(query))
      )
    );
  }, [searchQuery, books]);

  // 🔹 Read full paid book
  const readBook = async (book) => {
    try {
      const res = await fetch(`${BASE_URL}/api/paidBooks/read/${book._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to read book");
      const data = await res.json();
      setSelectedBook(data);
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch (err) {
      console.error("💥 Error reading book:", err);
      alert("Failed to load book text.");
    }
  };

  // 🔹 Buy / Read (Razorpay flow)
  const handleBuyOrRead = async (book) => {
    if (purchasedBookIds.includes(book._id)) {
      await readBook(book);
      return;
    }

    setProcessingBookId(book._id);

    try {
      const orderRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: book.price, bookId: book._id }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.message || "Order creation failed");

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Bookstore",
        description: book.title,
        order_id: orderData.order.id,

        // 🔹 Razorpay success handler
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${BASE_URL}/api/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookId: book._id,
                amount: book.price,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success)
              throw new Error(verifyData.message || "Verification failed");

            // 🔹 Record the purchase
            await fetch(`${BASE_URL}/api/book-purchase`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                bookId: book._id,
                amount: book.price,
                paymentId: response.razorpay_payment_id,
              }),
            });

            alert("✅ Payment successful! Opening your book...");

            // Mark as purchased and open
            setPurchasedBookIds((prev) => [...prev, book._id]);
            localStorage.setItem("lastPaidBook", JSON.stringify(book));

            // ✅ Open the book immediately (NO REDIRECT)
            await readBook(book);
          } catch (err) {
            console.error("💥 Payment verify/save error:", err);
            alert(`Payment verification failed: ${err.message}`);
          }
        },

        // ✅ THE FIX
        redirect: false,
        callback_url: undefined,

        prefill: { email: "user@example.com" },
        theme: { color: "#6B21A8" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        console.error(response.error);
        alert(`Payment failed: ${response.error.description}`);
      });

      // 🧠 Prevent unwanted reloads
      window.onbeforeunload = null;

      rzp.open();
    } catch (err) {
      console.error(err);
      alert(`Payment initiation failed: ${err.message}`);
    } finally {
      setProcessingBookId(null);
    }
  };

  const backToList = () => {
    setSelectedBook(null);
    navigate("/paid-books");
  };

  const getCoverUrl = (cover) =>
    cover?.startsWith("http")
      ? cover
      : cover
      ? `${BASE_URL}${cover}`
      : "/fallback-cover.jpg";

  const scrollToChapter = (anchorId) => {
    const el = document.getElementById(anchorId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) return <div className="text-center py-10">Loading paid books...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {!selectedBook ? (
        <>
          {/* Search */}
          <div className="mb-6 flex justify-center">
            <input
              type="text"
              placeholder="Search paid books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            />
          </div>

          {/* Books grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <PaidBookCard
                key={book._id}
                book={book}
                onBuyOrRead={handleBuyOrRead}
                isPurchased={purchasedBookIds.includes(book._id)}
                isProcessing={processingBookId === book._id}
              />
            ))}
          </div>
        </>
      ) : (
        // Reader View
        <div className="max-w-5xl mx-auto relative flex flex-col lg:flex-row">
          {/* TOC */}
         {selectedBook.chapters?.length > 0 && (
  <aside
    className="hidden lg:block sticky top-28 left-0 h-[75vh] w-64 mr-8 overflow-y-auto rounded-2xl shadow-lg 
    bg-white/90 dark:bg-slate-900/90 border border-gray-200 dark:border-slate-700 
    backdrop-blur-md transition-all duration-300 p-5 text-sm"
  >
    <h3 className="text-base font-bold mb-4 border-b border-gray-300 dark:border-slate-700 
    pb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
      📖 Contents
    </h3>

    <ul className="space-y-2">
      {selectedBook.chapters.map((ch, i) => (
        <li key={i}>
          <button
            onClick={() => scrollToChapter(ch.anchorId)}
            className="w-full text-left truncate px-2 py-1 rounded-md 
            text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 
            hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors duration-200"
          >
            {ch.title.length > 40 ? ch.title.slice(0, 40) + "..." : ch.title}
          </button>
        </li>
      ))}
    </ul>
  </aside>
)}


          {/* Main Reader */}
          <div className="flex-1 px-4">
            <div className="flex justify-center mb-6">
              <button
                onClick={backToList}
                className="px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 hover:brightness-110 shadow-md transition-all text-sm"
              >
                ← Back to Paid Books
              </button>
            </div>

            <div className="flex flex-col items-center text-center mb-8">
              <img
                src={getCoverUrl(selectedBook.cover)}
                alt={selectedBook.title}
                className="w-60 h-80 object-cover shadow-2xl rounded-xl mb-6"
              />
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">
                {selectedBook.title}
              </h1>
              {selectedBook.author && (
                <h4 className="text-sm text-gray-600 italic mt-2">{selectedBook.author}</h4>
              )}
            </div>
            
<div
  className="prose dark:prose-invert max-w-none px-6 py-8 rounded-2xl shadow-inner 
  bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 
  text-base leading-relaxed transition-colors duration-300 border border-gray-200 dark:border-slate-700"
>
  {selectedBook.blocks?.map((block, idx) => {
    if (block.type === "chapter") {
      return (
        <h2
          key={idx}
          id={block.anchorId}
          className="text-2xl font-bold mt-10 mb-4 border-b pb-2 text-gray-900 dark:text-gray-100"
        >
          {block.title}
        </h2>
      );
    }

    if (block.type === "paragraph") {
      return (
        <p
          key={idx}
          className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed"
        >
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
          className="my-6 mx-auto rounded-lg shadow-lg max-h-[400px] border border-gray-300 dark:border-slate-700"
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
