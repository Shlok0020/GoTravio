import express from "express";
import Enquiry from "../models/Enquiry.js";
import { sendEnquiryNotification } from "../services/emailService.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// ✅ TEST EMAIL ENDPOINT (Add this first)
router.post("/test-email", async (req, res) => {
  console.log("🧪 Testing email configuration...");
  
  try {
    // Create a test enquiry
    const testEnquiry = {
      _id: 'test-' + Date.now(),
      name: 'Test User',
      service: 'Test Service',
      phone: '9876543210',
      email: 'test@example.com',
      details: 'This is a test enquiry to check email functionality.',
      createdAt: new Date()
    };
    
    console.log("📧 Sending test email with data:", testEnquiry);
    
    const emailSent = await sendEnquiryNotification(testEnquiry);
    
    if (emailSent) {
      res.status(200).json({
        success: true,
        message: 'Test email sent successfully! Check your inbox.'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Test email failed. Check server logs for details.'
      });
    }
  } catch (error) {
    console.error('❌ Test email error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Test failed: ' + error.message
    });
  }
});

// ✅ Save Enquiry (Public Route)
router.post("/", async (req, res) => {
  console.log("\n📥 POST /api/enquiry - New enquiry received");
  console.log("Request body:", req.body);
  
  try {
    // Validate required fields
    const { name, service, phone } = req.body;
    if (!name || !service || !phone) {
      console.log("❌ Validation failed - Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Please provide: name, service type, and phone number"
      });
    }

    console.log("📝 Creating new enquiry:", { name, service, phone });
    
    // Create and save enquiry to MongoDB
    const enquiry = new Enquiry({
      name,
      service,
      phone,
      email: req.body.email || "",
      details: req.body.details || ""
    });

    const savedEnquiry = await enquiry.save();
    console.log("✅ Enquiry saved to MongoDB");
    console.log("📊 Enquiry ID:", savedEnquiry._id);
    console.log("📊 Created at:", savedEnquiry.createdAt);

    // Send email notification ASYNC (don't wait for it)
    console.log("📧 Triggering email notification...");
    sendEnquiryNotification(savedEnquiry)
      .then(success => {
        if (success) {
          console.log("✅ Email notification sent successfully");
        } else {
          console.log("⚠️ Email notification failed (check logs above)");
        }
      })
      .catch(err => {
        console.error("⚠️ Email promise error:", err.message);
      });

    // Send immediate response to client
    res.status(201).json({
      success: true,
      message: "Thank you! Your enquiry has been submitted successfully.",
      data: {
        id: savedEnquiry._id,
        name: savedEnquiry.name,
        service: savedEnquiry.service,
        phone: savedEnquiry.phone,
        timestamp: savedEnquiry.createdAt
      }
    });

  } catch (error) {
    console.error("❌ Server error saving enquiry:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Get All Enquiries (Admin Protected)
router.get("/", adminAuth, async (req, res) => {
  try {
    console.log("📊 GET /api/enquiry - Admin fetching enquiries");
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    
    console.log(`📊 Found ${enquiries.length} enquiries`);
    
    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    console.error("❌ Error fetching enquiries:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
      error: error.message
    });
  }
});

// ✅ Get Single Enquiry (Admin)
router.get("/:id", adminAuth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiry",
      error: error.message
    });
  }
});

// ✅ Update Enquiry Status (Admin)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { status, assignedTo, notes } = req.body;
    const updateData = {};
    
    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (notes) updateData.notes = notes;
    
    const updated = await Enquiry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }
    
    res.json({
      success: true,
      message: "Enquiry status updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating enquiry status"
    });
  }
});

export default router;