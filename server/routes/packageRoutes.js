import express from "express";
import { Package } from "../models/Package.js";

const router = express.Router();

// Public: get all packages
router.get("/", async (req, res) => {
  try {
    console.log("Fetching all packages...");
    const packages = await Package.find().sort({ createdAt: -1 });
    
    // Transform data to match frontend expectations
    const transformedPackages = packages.map(pkg => ({
      _id: pkg._id,
      title: pkg.title,
      location: pkg.location,
      destination: pkg.location, // Add destination field for compatibility
      description: pkg.description || `${pkg.title} - ${pkg.location}`,
      days: pkg.days,
      duration: pkg.days, // Add duration as alias for days
      priceFrom: pkg.priceFrom,
      price: pkg.priceFrom, // Add price as alias for priceFrom
      tag: pkg.tag || pkg.category || "Popular",
      category: pkg.category || pkg.tag || "Popular",
      imageUrl: pkg.imageUrl || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?q=80&w=1200`,
      image: pkg.imageUrl || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?q=80&w-1200`,
      images: pkg.images || [pkg.imageUrl] || [],
      highlights: pkg.highlights || ["Scenic Views", "Cultural Experience", "Comfortable Stay"]
    }));
    
    console.log(`Found ${transformedPackages.length} packages`);
    return res.json(transformedPackages);
  } catch (err) {
    console.error("Error fetching packages:", err.message);
    return res.status(500).json({ 
      message: "Error fetching packages",
      error: err.message 
    });
  }
});

// Public: get single package by ID
router.get("/:id", async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }
    return res.json(pkg);
  } catch (err) {
    console.error("Error fetching package:", err.message);
    return res.status(500).json({ message: "Error fetching package" });
  }
});

// Admin: create new package
router.post("/", async (req, res) => {
  try {
    const requiredFields = ['title', 'location', 'days', 'priceFrom'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }
    
    const pkg = await Package.create({
      title: req.body.title,
      location: req.body.location,
      days: req.body.days,
      priceFrom: req.body.priceFrom,
      description: req.body.description || `${req.body.title} - ${req.body.location}`,
      tag: req.body.tag || "Popular",
      category: req.body.category || req.body.tag || "Popular",
      imageUrl: req.body.imageUrl || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?q=80&w=1200`,
      images: req.body.images || [req.body.imageUrl] || [],
      highlights: req.body.highlights || ["Scenic Views", "Cultural Experience", "Comfortable Stay"]
    });
    
    return res.status(201).json(pkg);
  } catch (err) {
    console.error("Error creating package:", err.message);
    return res.status(400).json({ 
      message: "Error creating package",
      error: err.message 
    });
  }
});

// Admin: delete package
router.delete("/:id", async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }
    return res.json({ message: "Package deleted successfully" });
  } catch (err) {
    console.error("Error deleting package:", err.message);
    return res.status(400).json({ message: "Error deleting package" });
  }
});

// Admin: update package
router.put("/:id", async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }
    
    return res.json(pkg);
  } catch (err) {
    console.error("Error updating package:", err.message);
    return res.status(400).json({ message: "Error updating package" });
  }
});

export default router;