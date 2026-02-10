import express from "express";
import { Package } from "../models/Package.js";

const router = express.Router();

// Seed initial packages (for development)
router.post("/seed-packages", async (req, res) => {
  try {
    // Clear existing packages
    await Package.deleteMany({});
    
    const demoPackages = [
      {
        title: "Kashmir Paradise Tour",
        location: "Srinagar, Gulmarg, Pahalgam",
        description: "Experience the beauty of Kashmir with houseboat stays, shikara rides, and snow adventures in the Himalayas.",
        days: 7,
        priceFrom: 25000,
        tag: "Honeymoon",
        category: "Domestic",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200",
        highlights: ["Houseboat Stay", "Shikara Ride", "Skiing in Gulmarg", "Pahalgam Valley"]
      },
      {
        title: "Goa Beach & Culture",
        location: "North Goa, South Goa",
        description: "Sun, sand, and Portuguese heritage with beach shacks, water sports, and vibrant nightlife.",
        days: 5,
        priceFrom: 18000,
        tag: "Beach",
        category: "Domestic",
        imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200",
        highlights: ["Beach Hopping", "Water Sports", "Portuguese Churches", "Nightlife"]
      },
      {
        title: "Bali Luxury Retreat",
        location: "Ubud, Seminyak, Uluwatu",
        description: "Luxury villas, spa treatments, cultural experiences and pristine beaches in tropical Bali.",
        days: 8,
        priceFrom: 65000,
        tag: "International",
        category: "International",
        imageUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?q=80&w=1200",
        highlights: ["Luxury Villas", "Balinese Spa", "Temple Tours", "Beach Clubs"]
      },
      {
        title: "Kerala Backwaters",
        location: "Alleppey, Munnar, Kochi",
        description: "Houseboat cruise through backwaters, tea plantations, and Ayurvedic wellness treatments.",
        days: 6,
        priceFrom: 22000,
        tag: "Wellness",
        category: "Domestic",
        imageUrl: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1200",
        highlights: ["Houseboat Stay", "Tea Plantations", "Ayurvedic Spa", "Kathakali Show"]
      },
      {
        title: "Rajasthan Royal Heritage",
        location: "Jaipur, Udaipur, Jodhpur",
        description: "Palaces, forts, desert safaris, and cultural experiences in royal Rajasthan.",
        days: 8,
        priceFrom: 28000,
        tag: "Heritage",
        category: "Domestic",
        imageUrl: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=600&auto=format&fit=crop&q=60",
        highlights: ["Palace Stay", "Desert Safari", "Folk Performances", "Shopping"]
      }
    ];
    
    const packages = await Package.insertMany(demoPackages);
    return res.status(201).json({ 
      message: "Packages seeded successfully", 
      count: packages.length 
    });
  } catch (err) {
    console.error("Error seeding packages:", err.message);
    return res.status(500).json({ 
      message: "Error seeding packages",
      error: err.message 
    });
  }
});

export default router;