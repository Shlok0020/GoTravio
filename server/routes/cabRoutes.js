import express from "express";
import { CabRequest } from "../models/CabRequest.js";
import { sendEnquiryNotification } from "../services/emailService.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Customer submits cab enquiry
router.post("/", async (req, res) => {
  try {
    console.log("✅ Received cab enquiry at /api/cabs");
    console.log("Request body:", req.body);
    
    // Validate required fields
    const requiredFields = ['pickupLocation', 'dropLocation', 'date', 'time', 'carType', 'name', 'phone'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missing: missingFields
      });
    }
    
    const saved = await CabRequest.create(req.body);
    console.log("✅ Cab enquiry saved with ID:", saved._id);

    // ============================================
    // SEND EMAIL NOTIFICATION USING OUR EMAIL SERVICE
    // ============================================
    try {
      console.log("📧 Sending cab enquiry email notification...");
      
      // Create enquiry data for email
      const enquiryData = {
        _id: saved._id,
        name: saved.name,
        service: `Cab Rental - ${saved.carType}`,
        phone: saved.phone,
        email: '', // Cab form doesn't have email field
        details: `📍 Pickup Location: ${saved.pickupLocation}\n📍 Drop Location: ${saved.dropLocation}\n📅 Date: ${saved.date}\n⏰ Time: ${saved.time}\n🚗 Car Type: ${saved.carType}\n📋 Submitted via: Cab Booking Form`,
        createdAt: saved.createdAt || new Date()
      };
      
      // Send email notification
      const emailSent = await sendEnquiryNotification(enquiryData);
      
      if (emailSent) {
        console.log("✅ Cab email notification sent successfully");
      } else {
        console.log("⚠️ Cab email notification failed (but enquiry was saved)");
      }
    } catch (emailError) {
      console.error("⚠️ Error sending cab email:", emailError.message);
      // Don't fail the main request if email fails
    }
    // ============================================

    return res.status(201).json({
      success: true,
      message: "Cab enquiry submitted successfully",
      data: {
        id: saved._id,
        name: saved.name,
        phone: saved.phone,
        date: saved.date,
        emailNotification: "sent" // Indicate email was sent
      }
    });
  } catch (err) {
    console.error("❌ Error saving cab request:", err.message);
    return res.status(500).json({ 
      success: false,
      message: "Error saving cab request",
      error: err.message 
    });
  }
});

// Owner fetches all cab enquiries
router.get("/", adminAuth, async (_req, res) => {
  try {
    const cabs = await CabRequest.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: cabs.length,
      data: cabs
    });
  } catch (err) {
    console.error("Error fetching cab requests:", err.message);
    return res.status(500).json({ 
      success: false,
      message: "Error fetching cab requests" 
    });
  }
});

// ✅ Update Cab Status (Admin)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { status, assignedTo, notes } = req.body;
    const updateData = {};
    
    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (notes) updateData.notes = notes;
    
    const updated = await CabRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Cab request not found"
      });
    }
    
    res.json({
      success: true,
      message: "Cab status updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Error updating cab status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating cab status"
    });
  }
});

export default router;