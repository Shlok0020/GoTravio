// server/utils/notifyOwner.js
import nodemailer from "nodemailer";

// ⚠️ Put your real details here
const OWNER_EMAIL = "shlokdhabalia@gmail.com";
const SMTP_USER = "shlokdhabalia@gmail.com";
const SMTP_PASS = "cruu khhh fiae zqnd";

// Create transporter with silent error handling
let transporter;

try {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    // Increase timeout and handle errors silently
    connectionTimeout: 5000,
    socketTimeout: 5000,
    greetingTimeout: 5000,
  });

  // Verify connection in background (don't wait)
  transporter.verify((error) => {
    if (error) {
      console.log("⚠️ Email notifications disabled:", error.message);
      console.log("📝 Forms will still save to database.");
    } else {
      console.log("✅ Email service ready");
    }
  });
} catch (error) {
  console.log("⚠️ Email service initialization failed");
  console.log("📝 Forms will still save to database.");
  transporter = null;
}

export const notifyOwner = async ({ subject, text, html }) => {
  if (!transporter) {
    // Silently skip if transporter failed to initialize
    return null;
  }

  try {
    const mailOptions = {
      from: `"TripRoute" <${SMTP_USER}>`,
      to: OWNER_EMAIL,
      subject: subject,
      text: text,
      html: html || text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent:", subject.substring(0, 30) + "...");
    return info;
  } catch (err) {
    // Silent fail - don't log errors to avoid cluttering console
    return null;
  }
};