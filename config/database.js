const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mindbot";

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast if can't connect
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.warn("\n⚠️  MongoDB Atlas connection failed!");
    console.warn("📋 ACTION REQUIRED:");
    console.warn("   1. Go to: https://cloud.mongodb.com/");
    console.warn("   2. Click 'Network Access' (left sidebar)");
    console.warn("   3. Click 'ADD IP ADDRESS'");
    console.warn("   4. Click 'ALLOW ACCESS FROM ANYWHERE'");
    console.warn("   5. Click 'Confirm' and wait 1-2 minutes\n");
    console.warn(
      "🔄 App will continue in LIMITED MODE (no user accounts/history)\n"
    );
    // Don't exit - let app run for chat functionality
  }
}

mongoose.connection.on("disconnected", () => {
  // Silently handle - already warned user
});

mongoose.connection.on("error", (err) => {
  // Silently handle - already warned user
});

module.exports = connectDB;
