/**
 * Express server setup for handling file management and system verification routes.
 * 
 * This script initializes an Express server, connects to MongoDB, sets up routes for file management 
 * (upload, download, etc.), and system verification (file integrity checks). It also includes error handling, 
 * connection retries, logging, and graceful shutdown functionality.
 * 
 * @module server
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { mountRoutes } = require("./routes"); // Main routes including API docs
const fileRoutes = require("./routes/fileRoutes"); // File handling routes
const verificationRoutes = require("./routes/verificationRoutes"); // System verification routes
require("dotenv").config();

// Initialize express app
const app = express();

/**
 * Middleware to log incoming API requests.
 * Logs the HTTP method, URL, and the client IP.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function to call.
 * @returns {void}
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip;
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  next();
};

app.use(requestLogger);

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Mount routes
app.use("/api/files", fileRoutes);
app.use("/api/system", verificationRoutes);
mountRoutes(app); // This mounts the main routes including API docs

// MongoDB Connection Configuration
mongoose.set("strictQuery", false);

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in .env file");
  process.exit(1);
}

/**
 * Function to connect to MongoDB with retries in case of failure.
 * 
 * @async
 * @returns {Promise<void>} Resolves once the connection is established, or retries if it fails.
 */
const connectWithRetry = () => {
  console.log("Attempting to connect to MongoDB...");
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      connectTimeoutMS: 10000,
    })
    .then(() => {
      console.log("✅ MongoDB Connected Successfully!");
      const db = mongoose.connection.db;
      const host = mongoose.connection.host;

      if (db && host) {
        console.log(`📊 Database: ${db.databaseName}`);
        console.log(`🔌 Host: ${host}`);
      } else {
        console.warn("⚠️ Database or host information is not available.");
      }
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

/**
 * Middleware to handle errors.
 * Responds with a JSON object containing error details.
 * 
 * @param {Object} err - The error object.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function to call.
 * @returns {void}
 */
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Handle 404 routes - This should be the last middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    availableEndpoints: {
      docs: "/api/docs",
      health: "/health",
      files: "/api/files/*",
      system: "/api/system/*",
    },
  });
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
🚀 Server is running on port ${PORT}
📚 API Documentation: http://localhost:${PORT}/api/docs
📋 Postman Collection: http://localhost:${PORT}/api/docs/postman
💻 Health Check: http://localhost:${PORT}/health
⚙️ File Verification: http://localhost:${PORT}/api/system/verify-all
🔧 Environment: ${process.env.NODE_ENV || "development"}
  `);
});

/**
 * Graceful shutdown handler to close MongoDB connection and exit process.
 * 
 * @async
 * @returns {Promise<void>} Resolves when the server shuts down gracefully.
 */
const gracefulShutdown = async () => {
  console.log("\n🔄 Received shutdown signal. Starting graceful shutdown...");

  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  gracefulShutdown();
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown();
});

module.exports = app;
