// client/src/api.js
import axios from "axios";

/*
  This file works in BOTH:
  - Local development
  - Production (Vercel + Render)

  Local  : uses http://localhost:5000/api
  Live   : uses VITE_API_URL from environment variables
*/

// ============================================
// BASE URL
// ============================================

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("🌍 API Base URL:", BASE_URL);

// ============================================
// AXIOS INSTANCE
// ============================================

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("userToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );

    if (config.data) {
      console.log("📦 Data:", config.data);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error.message);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

API.interceptors.response.use(
  (response) => {
    console.log(
      `✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`
    );
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("❌ API Error:", error.response.status);
      console.error("Message:", error.response.data?.message);
    } else {
      console.error("❌ Network error: Backend not reachable");
    }
    return Promise.reject(error);
  }
);

// ============================================
// OPTIONAL ADMIN HEADERS
// ============================================

export const getAdminHeaders = () => {
  const token = localStorage.getItem("adminToken");
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export default API;
