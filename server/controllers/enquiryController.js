import Enquiry from '../models/Enquiry.js';
import { sendEnquiryNotification } from '../services/emailService.js';

export const createEnquiry = async (req, res) => {
  try {
    const { name, service, phone, email, details } = req.body;

    // Create enquiry in MongoDB
    const enquiry = new Enquiry({
      name,
      service,
      phone,
      email,
      details
    });

    // Save to database
    const savedEnquiry = await enquiry.save();
    console.log(`✅ Enquiry saved to MongoDB: ${savedEnquiry._id}`);

    // Send email notification using the SAVED enquiry data
    // This happens AFTER successful database save
    try {
      await sendEnquiryNotification(savedEnquiry);
      console.log(`📧 Email sent for enquiry ID: ${savedEnquiry._id}`);
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('⚠️ Email sending failed (enquiry still saved):', emailError);
    }

    // Send response
    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully!',
      data: savedEnquiry,
      enquiryId: savedEnquiry._id
    });

  } catch (error) {
    console.error('❌ Enquiry creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit enquiry',
      error: error.message
    });
  }
};

// Get all enquiries (for admin dashboard)
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries',
      error: error.message
    });
  }
};