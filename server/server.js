// ============================================
// LOAD ENVIRONMENT VARIABLES (LOCAL + RENDER)
// ============================================
import dotenv from "dotenv";
dotenv.config();

// ============================================
// IMPORTS
// ============================================
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import cabRoutes from "./routes/cabRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";

// ============================================
// APP INIT
// ============================================
const app = express();

// ============================================
// ENV VARIABLES
// ============================================
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travel-service";

// ============================================
// DATABASE CONNECTION
// ============================================
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// ============================================
// MIDDLEWARE
// ============================================

// CORS (open for now – safe for dev + demo)
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (dev friendly)
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ============================================
// BASE & HEALTH ROUTES
// ============================================

// Root
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Travel Backend is Live",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Test API
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "✅ Backend API is working!",
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    email: process.env.SMTP_USER ? "configured" : "not configured",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Email config test
app.get("/api/email-test", (req, res) => {
  res.json({
    success: true,
    smtpUser: process.env.SMTP_USER || "not set",
    smtpPassword: process.env.SMTP_PASSWORD
      ? `configured (${process.env.SMTP_PASSWORD.length} chars)`
      : "not set",
    adminEmail: process.env.ADMIN_EMAIL || "not set",
  });
});

// ============================================
// API ROUTES
// ============================================
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/cabs", cabRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/enquiry", enquiryRoutes);

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: NODE_ENV === "development" ? err.message : undefined,
  });
});

// ============================================
// START SERVER (RENDER-SAFE)
// ============================================
app.listen(PORT, "0.0.0.0", () => {
  console.log("=".repeat(50));
  console.log("✅ SERVER STARTED SUCCESSFULLY");
  console.log("=".repeat(50));
  console.log(`✅ Environment : ${NODE_ENV}`);
  console.log(`✅ Port        : ${PORT}`);
  console.log(`✅ Backend URL : http://localhost:${PORT}`);
  console.log(`✅ MongoDB URI : ${MONGO_URI}`);
  console.log("=".repeat(50));
});
