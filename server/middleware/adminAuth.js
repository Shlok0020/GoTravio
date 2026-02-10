// server/middleware/adminAuth.js

// 🔐 Change these three values for your setup
export const ADMIN_EMAIL = "admin@gmail.com";
export const ADMIN_PASSWORD = "admin@1234";       // choose your own password
export const ADMIN_TOKEN = "MySuperSecretAdminToken123"; // used internally

export const adminAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || token !== ADMIN_TOKEN) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};
