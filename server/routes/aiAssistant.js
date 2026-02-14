const express = require('express');
const router = express.Router();
const axios = require('axios');

// You can integrate with OpenAI or other AI services
// For now, this is a simple rule-based response system

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Simple response logic (replace with actual AI integration)
    let response = generateResponse(message);
    
    res.json({ 
      success: true, 
      response: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process message' 
    });
  }
});

function generateResponse(message) {
  const input = message.toLowerCase();
  
  if (input.includes('cab') || input.includes('taxi')) {
    return "I can help you book a cab! Please share your pickup location, drop location, and travel date.";
  } else if (input.includes('train') || input.includes('tatkal')) {
    return "Need train tickets? I can assist with Tatkal bookings. Share your route and travel date!";
  } else if (input.includes('flight') || input.includes('plane')) {
    return "Looking for flights? Tell me your departure city, destination, and travel dates!";
  } else if (input.includes('package') || input.includes('tour')) {
    return "Planning a vacation? Let me know your preferred destination and how many days!";
  } else if (input.includes('contact') || input.includes('phone')) {
    return "You can reach us at +91 90238 84833 or WhatsApp us at the same number!";
  } else {
    return "I'm here to help with your travel needs! Could you provide more details about what you're looking for?";
  }
}

module.exports = router;