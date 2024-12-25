const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const { connectToMongoDB } = require("./db");
const textRoutes = require("./routes/textRoutes");
const fileRoutes = require("./routes/fileRoutes");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { mountRoutes } = require("./routes"); // Main routes including API docs
const verificationRoutes = require("./routes/verificationRoutes"); // System verification routes
// Initialize Express app
const app = express();

// Middleware
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
(async () => {
  try {
    await connectToMongoDB();
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
})();

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for testing purposes",
    },
    servers: [
      {
        url: `http://dev.starteryou.com:${process.env.PORT || 3000}/api`,
      },
    ],
    tags: [
      { name: "TextRoutes", description: "Routes for text operations" },
      { name: "FileRoutes", description: "Routes for file operations" },
    ],
  },
  apis: ["./routes/*.js"], // Path to your API route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-test", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/system", verificationRoutes);
mountRoutes(app); // This mounts the main routes including API docs
// Routes
/**
 * @swagger
 * tags:
 *   - name: TextRoutes
 *     description: Routes for text operations
 */
app.use("/api", textRoutes);

/**
 * @swagger
 * tags:
 *   - name: FileRoutes
 *     description: Routes for file operations
 */
app.use("/api/files", fileRoutes);

// Health Check Route
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check server health
 *     responses:
 *       200:
 *         description: Server is running
 */
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

// MongoDB Connection Status Route
/**
 * @swagger
 * /db-status:
 *   get:
 *     summary: Check MongoDB connection status
 *     responses:
 *       200:
 *         description: MongoDB connection status
 */
app.get("/db-status", (req, res) => {
  const states = mongoose.STATES;
  const connectionState = mongoose.connection.readyState;
  res.json({
    state: connectionState,
    message: states[connectionState] || "Unknown state",
    host: mongoose.connection.host,
    dbName: mongoose.connection.name,
    uptime: process.uptime(),
  });
});

// Error-handling Middleware
app.use((err, req, res, next) => {
  console.error("🚨 Error:", err.message);
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong",
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://dev.starteryou.com:${PORT}`);
  console.log(
    `📖 Swagger Docs available at http://dev.starteryou.com:${PORT}/api-test`
  );
  console.log(`💻 Health Check: http://dev.starteryou.com:${PORT}/health`);
  console.log(
    `🗄️ Database Status: http://dev.starteryou.com:${PORT}/db-status`
  );
  console.log(
    `📚 API Documentation: http://dev.starteryou.com:${PORT}/api/docs`
  );
  console.log(
    `📋 Postman Collection: http://dev.starteryou.com:${PORT}/api/docs/postman`
  );
  console.log(
    `⚙️ File Verification: http://dev.starteryou.com:${PORT}/api/system/verify-all`
  );
});