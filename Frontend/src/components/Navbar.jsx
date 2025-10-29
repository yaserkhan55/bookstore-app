import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaBook,
  FaTachometerAlt,
  FaPhone,
  FaInfoCircle,
  FaMoon,
  FaSun,
  FaSignOutAlt,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    setToken(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const isHome = location.pathname === "/";

  const bottomButtons = (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 shadow-t border-t border-gray-200 dark:border-gray-700 z-50 lg:hidden">
      <div className="flex justify-around items-center py-2">
        <Link
          to="/books"
          className="flex flex-col items-center text-gray-800 dark:text-white text-sm py-2 px-3 hover:text-pink-600"
        >
          <FaBook size={18} />
          <span>Free Books</span>
        </Link>
        <Link
          to="/paid-books"
          className="flex flex-col items-center text-gray-800 dark:text-white text-sm py-2 px-3 hover:text-pink-600"
        >
          <FaBook size={18} />
          <span>Paid Books</span>
        </Link>
        {token && (
          <Link
            to="/dashboard"
            className="flex flex-col items-center text-gray-800 dark:text-white text-sm py-2 px-3 hover:text-pink-600"
          >
            <FaTachometerAlt size={18} />
            <span>Dashboard</span>
          </Link>
        )}
        {token ? (
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-red-600 dark:text-red-400 text-sm py-2 px-3 hover:text-red-500"
          >
            <FaSignOutAlt size={18} />
            <span>Logout</span>
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="flex flex-col items-center text-gray-800 dark:text-white text-sm py-2 px-3 hover:text-pink-600"
            >
              <FaTachometerAlt size={18} />
              <span>Login</span>
            </Link>
            <Link
              to="/signup"
              className="flex flex-col items-center text-gray-800 dark:text-white text-sm py-2 px-3 hover:text-pink-600"
            >
              <FaTachometerAlt size={18} />
              <span>Signup</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`max-w-screen-2xl container mx-auto md:px-20 px-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isHome
            ? "bg-transparent h-14"
            : `h-16 ${
                scrolled
                  ? "backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 shadow-xl"
                  : "bg-white dark:bg-slate-800 shadow-md"
              }`
        }`}
      >
        <div className="flex items-center justify-between py-3 relative">
          {/* Mobile Navbar */}
          <div className="lg:hidden flex items-center justify-between w-full">
            <button
              className="relative w-8 h-8 flex flex-col justify-center items-center"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span
                className={`h-1 w-6 rounded bg-gray-800 dark:bg-white transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`h-1 w-6 rounded bg-gray-800 dark:bg-white transition-all duration-300 my-1 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-1 w-6 rounded bg-gray-800 dark:bg-white transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>

            {/* Centered Website Name */}
            <Link
              to="/"
              className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-semibold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text tracking-tight"
            >
              Bookstore
            </Link>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden lg:flex items-center justify-between w-full">
            <Link
              to="/"
              className="text-3xl font-semibold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text tracking-tight"
            >
              Bookstore
            </Link>

            <ul className="flex items-center space-x-10 text-base text-gray-800 dark:text-gray-200 font-normal">
              <li>
                <Link to="/" className="hover:text-pink-600">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/books" className="hover:text-pink-600">
                  Free Books
                </Link>
              </li>
              <li>
                <Link to="/paid-books" className="hover:text-pink-600">
                  Paid Books
                </Link>
              </li>
              {token && (
                <li>
                  <Link to="/dashboard" className="hover:text-pink-600">
                    Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link to="/contact" className="hover:text-pink-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-pink-600">
                  About
                </Link>
              </li>
            </ul>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition-all duration-300 flex items-center gap-2"
              >
                {theme === "dark" ? <FaSun /> : <FaMoon />} Theme
              </button>
              {token ? (
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  <FaSignOutAlt /> Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition-all duration-300 flex items-center gap-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition-all duration-300 flex items-center gap-2"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            key={theme}
            className="lg:hidden bg-white dark:bg-slate-800 shadow-md p-4 space-y-3"
          >
            <Link
              to="/books"
              className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-pink-600"
            >
              <FaBook /> Free Books
            </Link>
            <Link
              to="/paid-books"
              className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-pink-600"
            >
              <FaBook /> Paid Books
            </Link>
            {token && (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-pink-600"
              >
                <FaTachometerAlt /> Dashboard
              </Link>
            )}
            <Link
              to="/contact"
              className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-pink-600"
            >
              <FaPhone /> Contact
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-pink-600"
            >
              <FaInfoCircle /> About
            </Link>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-pink-600 w-full"
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}{" "}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        )}
      </div>

      {bottomButtons}
    </>
  );
}

export default Navbar;
