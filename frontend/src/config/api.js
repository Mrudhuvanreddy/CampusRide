// src/config/api.js
// Centralized API base URL taken from Vite environment variable.
// Configured in Vercel / .env as VITE_API_URL=https://campusride-iq8w.onrender.com
export const API_BASE = (
    import.meta.env.VITE_API_URL || "https://campusride-iq8w.onrender.com"
).replace(/\/+$/, "");
