// server/routes/authRoutes.js

import express from "express";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_TOKEN,
} from "../middleware/adminAuth.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Return token that frontend will store & use
    return res.json({
      token: ADMIN_TOKEN,
      email,
    });
  }

  return res.status(401).json({ message: "Invalid email or password" });
});

export default router;
