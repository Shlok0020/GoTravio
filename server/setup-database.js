//server/setup-database.js
import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/travel-service";

async function setupDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Create collections if they don't exist
    const collections = ['enquiries', 'cabrequests', 'ticketrequests', 'packages'];
    
    for (const collection of collections) {
      const exists = await mongoose.connection.db.listCollections({ name: collection }).hasNext();
      if (!exists) {
        await mongoose.connection.db.createCollection(collection);
        console.log(`✅ Created collection: ${collection}`);
      } else {
        console.log(`✅ Collection already exists: ${collection}`);
      }
    }

    // Add test data
    const Enquiry = mongoose.model('Enquiry', new mongoose.Schema({
      name: String,
      service: String,
      phone: String,
      email: String,
      details: String,
      createdAt: { type: Date, default: Date.now }
    }));

    // Check if we need test data
    const count = await Enquiry.countDocuments();
    if (count === 0) {
      await Enquiry.create({
        name: "Test User",
        service: "Cab Rental",
        phone: "+911234567890",
        email: "test@example.com",
        details: "Test enquiry from setup script"
      });
      console.log("✅ Added test enquiry");
    }

    console.log("\n✅ Database setup complete!");
    console.log("📊 Collections:");
    const allCollections = await mongoose.connection.db.listCollections().toArray();
    allCollections.forEach(col => console.log(`   - ${col.name}`));

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    process.exit(1);
  }
}

setupDatabase();