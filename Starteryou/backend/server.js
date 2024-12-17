const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { mountRoutes } = require("./routes"); // Main routes including API docs
const fileRoutes = require("./routes/fileRoutes"); // File handling routes
const textRoutes = require("./routes/textRoutes");
const verificationRoutes = require("./routes/verificationRoutes"); // System verification routes
const logger = require("./utils/logger");
require("dotenv").config(); // Load environment variables

const router = express.Router();

mongoose.set('debug', true);
// Load MongoDB configuration from environment variables
const mongoUser = encodeURIComponent(process.env.MONGO_USER);
const mongoPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoDb = process.env.MONGO_DB;
const mongoAuthSource = process.env.MONGO_AUTH_SOURCE;
const mongoTls = process.env.MONGO_TLS === "true";
const mongoTlsCert = process.env.MONGO_TLS_CERT;
const mongoTlsCa = process.env.MONGO_TLS_CA;
const mongoAppName = process.env.MONGO_APP_NAME;

console.log("Loaded Environment Variables:", {
  mongoUser: process.env.MONGO_USER,
  mongoPassword: process.env.MONGO_PASSWORD,
  mongoHost: process.env.MONGO_HOST,
  mongoPort: process.env.MONGO_PORT,
  mongoDb: process.env.MONGO_DB,
  mongoAuthSource: process.env.MONGO_AUTH_SOURCE,
}); // Debugging line to ensure the environment variables are loaded

// Check for missing required environment variables
if (!mongoUser || !mongoPassword || !mongoHost || !mongoDb) {
  console.error("❌ Missing required MongoDB environment variables");
  process.exit(1);
}

// Build MongoDB URI dynamically based on environment variables
let mongoUri = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDb}?authSource=${mongoAuthSource}&directConnection=true&serverSelectionTimeoutMS=2000`;

if (mongoTls) {
  mongoUri += `&tls=true&tlsCertificateKeyFile=${encodeURIComponent(
    mongoTlsCert
  )}&tlsCAFile=${encodeURIComponent(mongoTlsCa)}`;
}

mongoUri += `&appName=${mongoAppName}`;

console.log("------------------------>" + mongoUri);

// Initialize express app
const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//docs
// Serve frontend docs
app.use(
  "/docs/frontend",
  express.static(path.join(__dirname, "frontend/docs"))
);

// Serve backend docs
app.use("/docs/backend", express.static(path.join(__dirname, "backend/docs")));

// Optional: Serve a combined docs route
app.use("/docs", (req, res) => {
  res.redirect("/docs/frontend/index.html"); // Redirect to frontend docs by default
});

// API Request Logger Middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip;
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  next();
};

app.use(requestLogger);

// Mount routes
app.use("/api/files", fileRoutes);
app.use("/api/system", verificationRoutes);
mountRoutes(app); // This mounts the main routes including API docs
app.use("/api", textRoutes); // Add the prefix here

// MongoDB Connection Configuration
mongoose.set("strictQuery", false);

const maxRetries = 5;
let retryCount = 0;
let isConnected = false; // Flag to track MongoDB connection status

const connectWithRetry = () => {
  if (isConnected) {
    console.log("✅ MongoDB is already connected. No further retries needed.");
    return; // If already connected, exit the function
  }

  if (retryCount >= maxRetries) {
    console.error("❌ Max retries reached. Exiting...");
    process.exit(1);
  }

  console.log("Attempting to connect to MongoDB...");
  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      connectTimeoutMS: 30000,
    })
    .then(() => {
      console.log("✅ MongoDB Connected Successfully!");
      isConnected = true; // Mark as connected
      // Accessing databaseName and host safely after connection is established
      const db = mongoose.connection.db;
      const host = mongoose.connection.host;

      if (db && host) {
        console.log(`📊 Database: ${db.databaseName}`);
        console.log(`🔌 Host: ${host}`);
      } else {
        console.warn("⚠ Database or host information is not available.");
      }
    })
    .catch((error) => {
      retryCount++;
      console.error("❌ MongoDB Connection Error:", error);
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectWithRetry, 5000); // Retry if connection fails
    });
};

// Initial connection attempt
connectWithRetry();

// Monitor MongoDB connection
mongoose.connection.on("disconnected", () => {
  console.log("❌ MongoDB Disconnected. Attempting to reconnect...");
  if (!isConnected) {
    connectWithRetry(); // Retry connection only if not connected yet
  }
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB Error:", err);
  if (err.name === "MongoNetworkError" && !isConnected) {
    connectWithRetry(); // Retry connection on network errors
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  // console.error("Error:", err.stack);
  logger.error(`Error: ${err.stack}`)
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Handle 404 routes - This should be the last middleware
app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.originalUrl} - Method: ${req.method}`);
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
  //   console.log(`
  // 🚀 Server is running on port ${PORT}
  // 📚 API Documentation: http://localhost:${PORT}/api/docs
  // 📋 Postman Collection: http://localhost:${PORT}/api/docs/postman
  // 💻 Health Check: http://localhost:${PORT}/health
  // ⚙ File Verification: http://localhost:${PORT}/api/system/verify-all
  // 🔧 Environment: ${process.env.NODE_ENV || "development"}
  //   `);
  logger.info(`
🚀 Server is running on port ${PORT}
📚 API Documentation: http://localhost:${PORT}/api/docs
📋 Postman Collection: http://localhost:${PORT}/api/docs/postman
💻 Health Check: http://localhost:${PORT}/health
⚙ File Verification: http://localhost:${PORT}/api/system/verify-all
🔧 Environment: ${process.env.NODE_ENV || "development"}
  `);
});

// Graceful shutdown handler
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
