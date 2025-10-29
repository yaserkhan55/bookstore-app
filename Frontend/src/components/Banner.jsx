// src/components/Banner.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Banner() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="relative h-screen flex items-center justify-center 
                    bg-gradient-to-r from-pink-100 via-white to-purple-100 
                    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 
                    transition-all duration-500 overflow-hidden">

      {/* Blur overlay for logged-out users */}
      {!token && (
        <div className="absolute inset-0 backdrop-blur-sm brightness-75 z-0 pointer-events-none"></div>
      )}

      {/* Floating icons & tiny books */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <span className="absolute top-10 left-8 text-3xl animate-float">📖</span>
        <span className="absolute top-1/3 right-10 text-4xl animate-float animation-delay-2000">💡</span>
        <span className="absolute bottom-20 left-1/4 text-3xl animate-float animation-delay-1000">🎓</span>
        <span className="absolute bottom-10 right-1/3 text-4xl animate-float animation-delay-3000">🖋️</span>

        {/* Tiny floating books */}
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className={`absolute text-2xl animate-float`}
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              animationDelay: `${Math.random() * 5000}ms`,
            }}
          >
            📚
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 
                       bg-gradient-to-r from-pink-600 to-purple-600 
                       bg-clip-text text-transparent drop-shadow-lg animate-float">
          Welcome to Bookstore 📚
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          Discover, read, and manage your favorite books and courses all in one place. Join us today and unlock your learning journey!
        </p>

        {/* CTA Button */}
        {!token && (
          <div className="mt-6 animate-float">
            <Link
              to="/signup"
              className="relative z-10 inline-block px-8 py-3 text-lg font-semibold text-white rounded-full
                         bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600
                         shadow-lg shadow-pink-500/30 
                         transition-transform duration-300 ease-out
                         hover:scale-105 hover:shadow-pink-500/50
                         focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-white
                         overflow-hidden"
            >
              <span className="relative z-10">🚀 Get Started</span>
              <span
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent
                           -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700 ease-in-out"
              ></span>
            </Link>
          </div>
        )}
      </div>

      {/* Main flipping book */}
      <div className="absolute bottom-0 right-10 w-36 h-36 md:w-48 md:h-48 z-10 pointer-events-none">
        <div className="relative w-full h-full perspective-1000">
          <div className="absolute w-1/2 h-full left-0 top-0 bg-pink-400 dark:bg-pink-600 origin-left transform transition-transform duration-700 animate-page-flip rounded-l-lg shadow-lg z-20"></div>
          <div className="absolute w-1/2 h-full right-0 top-0 bg-purple-500 dark:bg-purple-700 origin-right transform transition-transform duration-700 animate-page-flip rounded-r-lg shadow-lg z-10"></div>
          <div className="absolute w-2 h-full left-1/2 top-0 bg-gray-800 dark:bg-gray-700 z-30 rounded"></div>
          <span className="absolute top-4 left-1/4 text-white font-bold text-sm animate-float">Learn 💡</span>
        </div>
      </div>
    </div>
  );
}

export default Banner;
