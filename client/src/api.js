
//client/src/api.js
import axios from "axios";

// Try different ports in case one is busy
const PORTS_TO_TRY = [5000, 5001, 5002, 5003, 5004];
let currentBaseURL = "";

// Function to test backend connection
const testBackendConnection = async (port) => {
  try {
    const testURL = `http://localhost:${port}/api/test`;
    const response = await axios.get(testURL, { timeout: 2000 });
    return response.data.success ? port : null;
  } catch (error) {
    return null;
  }
};

// Find working backend port
const findWorkingBackend = async () => {
  console.log("🔍 Looking for backend server...");
  
  for (const port of PORTS_TO_TRY) {
    console.log(`Trying port ${port}...`);
    const result = await testBackendConnection(port);
    if (result) {
      console.log(`✅ Found backend on port ${port}`);
      return `http://localhost:${port}/api`;
    }
  }
  
  console.warn("⚠️ Backend not found on any port. Using default port 5000");
  return "http://localhost:5000/api";
};

// Create API instance
const API = axios.create({
  baseURL: "", // Will be set dynamically
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Initialize baseURL
findWorkingBackend().then(url => {
  currentBaseURL = url;
  API.defaults.baseURL = url;
  console.log(`✅ API baseURL set to: ${url}`);
}).catch(err => {
  console.error("❌ Failed to find backend:", err);
  // Fallback to default
  API.defaults.baseURL = "http://localhost:5000/api";
});

// Add interceptors for debugging
API.interceptors.request.use(
  (config) => {
    // Use current baseURL if not set
    if (!config.baseURL && currentBaseURL) {
      config.baseURL = currentBaseURL;
    }
    console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    if (config.data) {
      console.log("Request data:", config.data);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error.message);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ Response error:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("No response received. Is backend running?");
      console.error("Tried URL:", error.config?.baseURL + error.config?.url);
    } else {
      console.error("Request setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const getAdminHeaders = () => {
  const token = localStorage.getItem("adminToken");
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export { API };