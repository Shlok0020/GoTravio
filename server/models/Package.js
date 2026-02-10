import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, "Title is required"],
      trim: true
    },
    location: { 
      type: String, 
      required: [true, "Location is required"],
      trim: true
    },
    days: { 
      type: Number, 
      required: [true, "Days is required"],
      min: [1, "Days must be at least 1"]
    },
    priceFrom: { 
      type: Number, 
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },
    description: { 
      type: String,
      default: ""
    },
    tag: { 
      type: String,
      enum: ["Domestic", "International", "Honeymoon", "Adventure", "Family", "Beach", "Wellness", "Heritage", "Luxury", "Popular"],
      default: "Popular"
    },
    category: { 
      type: String,
      enum: ["Domestic", "International", "Honeymoon", "Adventure", "Family", "Beach", "Wellness", "Heritage", "Luxury", "Popular"],
      default: "Popular"
    },
    imageUrl: { 
      type: String,
      default: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200"
    },
    images: [{ 
      type: String 
    }],
    highlights: [{ 
      type: String 
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for duration (alias of days)
packageSchema.virtual('duration').get(function() {
  return this.days;
});

// Virtual field for destination (alias of location)
packageSchema.virtual('destination').get(function() {
  return this.location;
});

// Virtual field for price (alias of priceFrom)
packageSchema.virtual('price').get(function() {
  return this.priceFrom;
});

// Virtual field for image (alias of imageUrl)
packageSchema.virtual('image').get(function() {
  return this.imageUrl;
});

export const Package = mongoose.model("Package", packageSchema);