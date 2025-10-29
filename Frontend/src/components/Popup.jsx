// src/components/Popup.jsx
import React, { useEffect, useState } from "react";

export default function Popup({ message, type = "info", onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;

    // Start fade-in
    setVisible(true);

    // Auto fade-out after 2.5s
    const timer = setTimeout(() => {
      setVisible(false);
      // Call onClose after fade-out transition
      setTimeout(onClose, 300);
    }, 2500);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div
      className={`fixed top-20 right-6 z-50 px-4 py-2 rounded-lg shadow-lg text-white transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      } ${
        type === "success"
          ? "bg-green-500"
          : type === "error"
          ? "bg-red-500"
          : "bg-blue-500"
      }`}
    >
      {message}
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 font-bold text-white"
      >
        ✖
      </button>
    </div>
  );
}
