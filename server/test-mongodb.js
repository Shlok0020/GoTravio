// server/test-mongodb.js
import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/travel-service";

async function testMongoDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Test TicketRequest model
    const TicketRequest = mongoose.model('TicketRequest', new mongoose.Schema({
      from: String,
      to: String,
      date: String,
      phone: String,
      ticketMode: String,
    }));

    // Create test data
    const testTicket = await TicketRequest.create({
      from: "Test City",
      to: "Test Destination", 
      date: "2024-12-31",
      phone: "9876543210",
      ticketMode: "train",
      source: "test"
    });

    console.log("✅ Test ticket saved to MongoDB!");
    console.log("ID:", testTicket._id);
    console.log("From:", testTicket.from);
    console.log("To:", testTicket.to);

    // Verify it exists in database
    const found = await TicketRequest.findById(testTicket._id);
    console.log("✅ Found in database:", found ? "YES" : "NO");

    // Clean up test data
    await TicketRequest.deleteOne({ _id: testTicket._id });
    console.log("✅ Test data cleaned up");

    mongoose.connection.close();
    
  } catch (error) {
    console.error("❌ MongoDB test failed:", error.message);
  }
}

testMongoDB();