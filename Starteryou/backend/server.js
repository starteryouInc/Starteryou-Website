// server.js
const express = require("express");
const mongoose = require("mongoose");
const fileRoutes = require("./routes/fileRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/files", fileRoutes); // Assuming this is your route

// Set mongoose options
mongoose.set("strictQuery", false);

// Validate MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in .env file");
  process.exit(1); // Exit the process if no URI is provided
}

// MongoDB Connection with retries
const connectWithRetry = () => {
  console.log("Attempting to connect to MongoDB...");
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      retryWrites: true,
    })
    .then(() => {
      console.log("✅ MongoDB Connected Successfully!");
      console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
      console.log(`🔌 Host: ${mongoose.connection.host}`);
    })
    .catch((error) => {
      console.error("❌ MongoDB Connection Error:", error);
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    });
};

// Initial connection attempt
connectWithRetry();

// Monitor MongoDB connection
mongoose.connection.on("disconnected", () => {
  console.log("❌ MongoDB Disconnected. Attempting to reconnect...");
  connectWithRetry();
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB Error:", err);
  if (err.name === "MongoNetworkError") {
    connectWithRetry();
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
