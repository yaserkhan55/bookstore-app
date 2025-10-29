// src/components/DarkTest.jsx
import React, { useState, useEffect } from "react";

export default function DarkTest() {
  const [theme, setTheme] = useState("light");

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Tailwind Dark Mode Test</h1>
      <p className="mb-4">Current theme: {theme}</p>
      <button
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        Toggle Theme
      </button>
    </div>
  );
}
