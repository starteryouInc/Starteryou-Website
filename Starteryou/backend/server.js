// server.js
require("dotenv").config(); // Add this at the very top

const express = require("express");
const connectDB = require("./config/db");
const fileRoutes = require("./routes/fileRoutes");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Set mongoose options
mongoose.set("strictQuery", false);

// MongoDB Connection with status messages
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully!');
  console.log(`📊 Database: ${mongoose.connection.name}`);
  console.log(`🔌 Host: ${mongoose.connection.host}`);
})
.catch((error) => {
  console.error('❌ MongoDB Connection Error:', error);
  process.exit(1); // Exit process with failure
});

// Monitor MongoDB connection
mongoose.connection.on('disconnected', () => {
  console.log('❌ MongoDB Disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB Error:', err);
});

// CORS configuration for production
// In server.js
const corsOptions = {
  origin: [
    "http://54.196.202.145:8080",  // Your frontend URL
    "http://54.196.202.145:3000",  // Your backend URL
    "http://localhost:8080",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// Add OPTIONS preflight
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// Middleware
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "50mb"}));

// Routes
app.use("/api/files", fileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// Health check route with MongoDB status
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    environment: process.env.NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Handle undefined routes
app.use("*", (req, res) => {
  res.status(404).json({message: "Route not found"});
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});