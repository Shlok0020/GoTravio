// server/models/TicketRequest.js
import mongoose from "mongoose";

const ticketRequestSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: String, required: true },
    serviceType: { type: String, default: "Normal" },
    passengers: { type: String, required: true },
    passengerNames: [{ type: String }],
    phone: { type: String, required: true },
    email: { type: String },
    travelClass: { type: String },
    flightClass: { type: String },
    preferredTime: { type: String },
    specialRequest: { type: String },
    tripType: { type: String, default: "One Way" },
    returnDate: { type: String },
    ticketMode: { type: String, required: true, enum: ['train', 'flight'] },
    source: { type: String, default: "website_form" },
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
    },
    pnrNumber: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export const TicketRequest = mongoose.model(
  "TicketRequest",
  ticketRequestSchema
);