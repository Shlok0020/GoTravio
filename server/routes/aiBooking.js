// server/routes/aiBooking.js
import express from 'express';
import { CabRequest } from '../models/CabRequest.js';
import { TicketRequest } from '../models/TicketRequest.js';
import { sendEnquiryNotification } from '../services/emailService.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  console.log('✅ AI Test endpoint hit');
  res.json({ 
    success: true, 
    message: '✅ AI Booking API is working!',
    timestamp: new Date().toISOString()
  });
});

// Process AI booking requests
router.post('/process', async (req, res) => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 AI PROCESS ENDPOINT HIT!');
  console.log('='.repeat(60));
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { type, data } = req.body;
    
    if (!type || !data) {
      console.log('❌ Missing type or data');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    console.log(`📋 Processing ${type} booking for:`, data.name);
    console.log('📞 Phone:', data.phone);
    
    // Validate phone
    if (!data.phone || data.phone.length < 10) {
      console.log('❌ Invalid phone number');
      return res.status(400).json({
        success: false,
        message: 'Valid phone number is required'
      });
    }
    
    let savedBooking = null;
    
    // Save based on type
    switch(type) {
      case 'cab':
        console.log('🚗 Saving cab booking...');
        savedBooking = await CabRequest.create({
          pickupLocation: data.pickupLocation || data.pickup,
          dropLocation: data.dropLocation || data.drop,
          date: data.date,
          time: data.time || 'Not specified',
          carType: data.carType || 'Any',
          name: data.name,
          phone: data.phone,
          status: 'pending',
          source: 'AI Assistant'
        });
        console.log('✅ Cab booking saved with ID:', savedBooking._id);
        break;
        
      case 'train':
        console.log('🚂 Saving train booking...');
        savedBooking = await TicketRequest.create({
          from: data.from,
          to: data.to,
          date: data.date,
          passengers: data.passengers || '1',
          passengerNames: [data.name],
          phone: data.phone,
          email: data.email || '',
          ticketMode: 'train',
          source: 'AI Assistant',
          status: 'pending'
        });
        console.log('✅ Train booking saved with ID:', savedBooking._id);
        break;
        
      case 'flight':
        console.log('✈️ Saving flight booking...');
        savedBooking = await TicketRequest.create({
          from: data.from,
          to: data.to,
          date: data.date,
          passengers: data.passengers || '1',
          passengerNames: [data.name],
          phone: data.phone,
          email: data.email || '',
          flightClass: data.flightClass || 'Economy',
          tripType: data.tripType || 'One Way',
          ticketMode: 'flight',
          source: 'AI Assistant',
          status: 'pending'
        });
        console.log('✅ Flight booking saved with ID:', savedBooking._id);
        break;
        
      case 'package':
        console.log('🏝️ Saving package enquiry...');
        // Use Enquiry model for packages
        try {
          const Enquiry = (await import('../models/Enquiry.js')).default;
          savedBooking = await Enquiry.create({
            name: data.name,
            service: `Tour Package - ${data.destination}`,
            phone: data.phone,
            email: data.email || '',
            details: `Destination: ${data.destination}\nDuration: ${data.duration}\nTravelers: ${data.travelers}\nBudget: ${data.budget || 'Not specified'}`,
            status: 'pending',
            source: 'AI Assistant'
          });
          console.log('✅ Package enquiry saved with ID:', savedBooking._id);
        } catch (err) {
          console.log('❌ Error saving package:', err.message);
          throw new Error('Could not save package enquiry');
        }
        break;
        
      default:
        console.log('❌ Invalid type:', type);
        return res.status(400).json({
          success: false,
          message: 'Invalid booking type'
        });
    }
    
    // Generate booking reference
    const bookingRef = savedBooking._id.toString().slice(-8).toUpperCase();
    console.log('📋 Booking reference:', bookingRef);
    
    // Send email notification
    console.log('📧 Attempting to send email...');
    let emailSent = false;
    
    try {
      const enquiryData = {
        _id: savedBooking._id,
        name: data.name,
        service: `${type.toUpperCase()} Booking via AI Assistant`,
        phone: data.phone,
        email: data.email || '',
        details: formatBookingDetails(type, data, bookingRef),
        createdAt: new Date()
      };
      
      emailSent = await sendEnquiryNotification(enquiryData);
      console.log(emailSent ? '✅ Email sent!' : '❌ Email failed');
    } catch (emailError) {
      console.error('❌ Email error:', emailError.message);
    }
    
    console.log('='.repeat(60));
    console.log('✅ SUCCESS! Returning response to client');
    console.log('='.repeat(60));
    
    res.json({
      success: true,
      message: 'Booking processed successfully',
      bookingId: bookingRef,
      bookingReference: bookingRef,
      emailSent: emailSent,
      status: 'pending',
      data: {
        id: savedBooking._id,
        name: data.name,
        phone: data.phone
      }
    });
    
  } catch (error) {
    console.error('\n❌❌❌ ERROR ❌❌❌');
    console.error(error);
    console.error('='.repeat(60));
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process booking'
    });
  }
});

function formatBookingDetails(type, data, bookingRef) {
  let details = `📋 **Booking Reference:** ${bookingRef}\n`;
  details += `📅 **Time:** ${new Date().toLocaleString()}\n\n`;
  
  switch(type) {
    case 'cab':
      details += `📍 **Pickup:** ${data.pickupLocation || data.pickup}\n`;
      details += `📍 **Drop:** ${data.dropLocation || data.drop}\n`;
      details += `📅 **Date:** ${data.date}\n`;
      details += `⏰ **Time:** ${data.time || 'Not specified'}\n`;
      details += `👥 **Passengers:** ${data.passengers}\n`;
      break;
    case 'train':
      details += `🚂 **From:** ${data.from}\n`;
      details += `🚂 **To:** ${data.to}\n`;
      details += `📅 **Date:** ${data.date}\n`;
      details += `👥 **Passengers:** ${data.passengers}\n`;
      break;
    case 'flight':
      details += `✈️ **From:** ${data.from}\n`;
      details += `✈️ **To:** ${data.to}\n`;
      details += `📅 **Date:** ${data.date}\n`;
      details += `👥 **Passengers:** ${data.passengers}\n`;
      break;
    case 'package':
      details += `🏝️ **Destination:** ${data.destination}\n`;
      details += `📅 **Duration:** ${data.duration}\n`;
      details += `👥 **Travelers:** ${data.travelers}\n`;
      break;
  }
  
  details += `\n👤 **Name:** ${data.name}\n`;
  details += `📞 **Phone:** ${data.phone}\n`;
  if (data.email) details += `📧 **Email:** ${data.email}\n`;
  
  return details;
}

export default router;