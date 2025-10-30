// src/config.js
const isProduction = import.meta.env.MODE === "production";

export const BASE_URL = isProduction
  ? "https://bookstore-app-backend-v1.vercel.app" // ✅ Backend deployed URL
  : "http://localhost:5000"; // ✅ Local backend for testing
