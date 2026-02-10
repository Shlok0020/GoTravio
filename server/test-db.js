//server/test-db.js
import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/travel-service";

async function testConnection() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📁 Collections:", collections.map(c => c.name));
    
    // Test a simple insert
    const testDoc = await mongoose.connection.db.collection('test').insertOne({
      test: "data",
      timestamp: new Date()
    });
    console.log("✅ Test document inserted with ID:", testDoc.insertedId);
    
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ MongoDB error:", error.message);
  }
}

testConnection();