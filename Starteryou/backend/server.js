const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const sessionRoutes = require("./routes/sessionRoutes");
const { connectToMongoDB, mongoUri } = require("./db");
const MongoStore = require("connect-mongo");
const textRoutes = require("./routes/textRoutes");
const fileRoutes = require("./routes/fileRoutes");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const teamRoutes = require("./routes/teamRoutes");
const { mountRoutes } = require("./routes"); // Main routes including API docs
const verificationRoutes = require("./routes/verificationRoutes"); // System verification routes
const authRoutes = require("./routes/authRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes"); //newsletter subscribers
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
const { router } = require("./routes/index");
const logger = require("./utils/logger");

// Initialize Express app
const app = express();

// Middleware
dotenv.config();
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Frontend URL
    credentials: true, // Allow cookies to be sent
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// **Request logging middleware for all incoming requests**
app.use((req, res, next) => {
  logger.info(`Incoming Request: ${req.method} ${req.url} from ${req.ip}`);
  next();
});

const sessionStore = MongoStore.create({
  mongoUrl: mongoUri, // MongoDB URI
});

sessionStore.on("connected", async () => {
  try {
    logger.info("Clearing session store...");
    await sessionStore.clear(); // Clear all sessions
    logger.info("Session store cleared successfully.");
  } catch (err) {
    logger.error("Error clearing session store:", err);
  }
});

// Configure session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS and set to false if using local environment
      sameSite: "Lax", // Set to 'None' for cross-origin cookies and set to 'Lax' for same-origin in local environment
      maxAge: 60 * 60 * 1000, // 1 hour session duration
    },
  })
);

app.use("/api/newsletter", newsletterRoutes); //Newsletter subscribers

// MongoDB connection
(async () => {
  try {
    await connectToMongoDB();
    logger.info("✅ MongoDB connected successfully");
  } catch (err) {
    logger.error("❌ MongoDB Connection Error:", err.message);
  }
})();

const cacheOptions = {
  maxAge: "1y", // Cache for 1 year
  immutable: true, // Prevent revalidation if the file hasn't changed
};
app.use("/docs", express.static(path.join(__dirname, "docs"), cacheOptions));
logger.info("📂 Serving static files from:", path.join(__dirname, "docs"));

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
        url: `${BACKEND_URL}/api`,
      },
    ],
    tags: [
      { name: "TextRoutes", description: "Routes for text operations" },
      { name: "FileRoutes", description: "Routes for file operations" },
      {
        name: "Authentication",
        description: "Routes for Authentication endpoints",
      },
      {
        name: "Newsletter",
        description: "Routes for newsletter subscriptions",
      }, // Add this line
    ],
  },
  apis: ["./routes/*.js"], // Path to your API route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-test", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/system", verificationRoutes);
mountRoutes(app); // This mounts the main routes including API docs

app.use("/api", sessionRoutes); // Mount sessionRoutes

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

/**
 * @swagger
 * tags:
 *   - name: TeamRoutes
 *     description: Routes for file operations
 */
app.use("/api", teamRoutes);

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Routes for Authentication endpoints
 */
app.use("/api/v1/auth", authRoutes);

/**
 * Uses the imported router in the Express application.
 * @param {import("express").Express} app - The Express application instance.
 */
app.use(router);

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
  logger.error("🚨 Error:", err.message);
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong",
  });
});

// Start Server
const PORT = process.env.PORT || 3000;

// chek dev branch
app.listen(PORT, () => {
  logger.info(`🚀 Server running at http://dev.starteryou.com:${PORT}`);
  logger.info(
    `📖 Swagger Docs available at http://dev.starteryou.com:${PORT}/api-test`
  );
  logger.info(`💻 Health Check: http://dev.starteryou.com:${PORT}/health`);
  logger.info(
    `🗄️ Database Status: http://dev.starteryou.com:${PORT}/db-status`
  );
  logger.info(
    `📚 API Documentation: http://dev.starteryou.com:${PORT}/api/docs`
  );
  logger.info(
    `📋 Postman Collection: http://dev.starteryou.com:${PORT}/api/docs/postman`
  );
  logger.info(
    `⚙️ File Verification: http://dev.starteryou.com:${PORT}/api/system/verify-all`
  );
});
