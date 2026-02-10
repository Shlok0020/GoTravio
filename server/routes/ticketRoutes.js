import express from "express";
import { TicketRequest } from "../models/TicketRequest.js";
import { sendEnquiryNotification } from "../services/emailService.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Received ticket enquiry:");
    console.log("Request body:", req.body);
    
    // Validate required fields
    if (!req.body.from || !req.body.to || !req.body.date || !req.body.phone || !req.body.ticketMode) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        required: ["from", "to", "date", "phone", "ticketMode"]
      });
    }
    
    const saved = await TicketRequest.create(req.body);
    console.log("✅ Ticket enquiry saved with ID:", saved._id);

    // ============================================
    // SEND EMAIL NOTIFICATION USING OUR EMAIL SERVICE
    // ============================================
    try {
      console.log("📧 Sending ticket enquiry email notification...");
      
      const { from, to, date, ticketMode, passengers, phone, email, serviceType, travelClass, flightClass, tripType, returnDate } = saved;
      
      // Create enquiry data for email
      const enquiryData = {
        _id: saved._id,
        name: saved.passengerNames?.[0] || 'Customer',
        service: `${ticketMode === 'train' ? 'Train' : 'Flight'} Ticket Booking`,
        phone: phone,
        email: email || '',
        details: `✈️ From: ${from}\n✈️ To: ${to}\n📅 Date: ${date}\n🎫 Type: ${ticketMode}\n👥 Passengers: ${passengers || '1'}\n${ticketMode === 'train' ? `🚆 Service: ${serviceType || 'Not specified'}` : `✈️ Trip: ${tripType || 'Not specified'}`}\n${ticketMode === 'train' ? `🎫 Class: ${travelClass || 'Not specified'}` : `✈️ Class: ${flightClass || 'Not specified'}`}\n${returnDate ? `🔄 Return Date: ${returnDate}` : ''}\n📋 Submitted via: Ticket Booking Form`,
        createdAt: saved.createdAt || new Date()
      };
      
      // Send email notification
      const emailSent = await sendEnquiryNotification(enquiryData);
      
      if (emailSent) {
        console.log("✅ Ticket email notification sent successfully");
      } else {
        console.log("⚠️ Ticket email notification failed (but enquiry was saved)");
      }
    } catch (emailError) {
      console.error("⚠️ Error sending ticket email:", emailError.message);
      // Don't fail the main request if email fails
    }
    // ============================================

    return res.status(201).json({
      success: true,
      message: "Ticket enquiry submitted successfully",
      data: saved
    });
  } catch (err) {
    console.error("Error saving ticket request:", err.message);
    return res.status(500).json({ 
      success: false,
      message: "Error saving ticket request",
      error: err.message 
    });
  }
});

router.get("/", adminAuth, async (_req, res) => {
  try {
    const tickets = await TicketRequest.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (err) {
    console.error("Error fetching ticket requests:", err.message);
    return res.status(500).json({ 
      success: false,
      message: "Error fetching ticket requests" 
    });
  }
});

// ✅ Update Ticket Status (Admin)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { status, assignedTo, notes } = req.body;
    const updateData = {};
    
    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (notes) updateData.notes = notes;
    
    const updated = await TicketRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }
    
    res.json({
      success: true,
      message: "Ticket status updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating ticket status"
    });
  }
});

export default router;