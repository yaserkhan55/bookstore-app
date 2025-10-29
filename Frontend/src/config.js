// Frontend/src/config.js
export const API_URL = import.meta.env.PROD
  ? '/api' // production (Vercel)
  : 'http://localhost:5000/api'; // local development
