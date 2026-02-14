
// server/models/AIBooking.js
import mongoose from 'mongoose';

const AIBookingSchema = new mongoose.Schema({
  bookingType: {
    type: String,
    enum: ['cab', 'train', 'flight', 'package', 'contact', 'status'],
    required: true
  },
  bookingData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  userDetails: {
    name: String,
    phone: {
      type: String,
      required: true
    },
    email: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  bookingReference: {
    type: String,
    unique: true
  },
  source: {
    type: String,
    default: 'AI Assistant'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  processedAt: Date,
  notes: String
});

// Generate unique booking reference
AIBookingSchema.pre('save', async function(next) {
  if (!this.bookingReference) {
    const prefix = this.bookingType.toUpperCase().slice(0, 2);
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.bookingReference = `${prefix}${timestamp}${random}`;
  }
  next();
});

const AIBooking = mongoose.model('AIBooking', AIBookingSchema);
export default AIBooking;