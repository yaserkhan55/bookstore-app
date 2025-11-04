// src/api.js

// Automatically choose the right backend API base URL
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api" // Local backend
    : import.meta.env.VITE_API_BASE_URL; // Backend deployed on Vercel

export default API_BASE_URL;
