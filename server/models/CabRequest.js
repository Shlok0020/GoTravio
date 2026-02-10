// server/models/CabRequest.js
import mongoose from "mongoose";

const cabRequestSchema = new mongoose.Schema(
  {
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    carType: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    // ADD THESE FIELDS:
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected'],
      default: 'pending'
    },
    assignedTo: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export const CabRequest = mongoose.model("CabRequest", cabRequestSchema);