const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { connectToMongoDB, mongoUri } = require("./db");
const { storeMetadataInDB } = require("./metadata/storeMetadataInDB"); // Import metadata function
const sessionRoutes = require("./routes/sessionRoutes");
const textRoutes = require("./routes/textRoutes");
const fileRoutes = require("./routes/fileRoutes");
const teamRoutes = require("./routes/teamRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const authRoutes = require("./routes/authRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const { mountRoutes } = require("./routes");
const { router } = require("./routes/index");
const logger = require("./utils/logger");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const BACKEND_URL = process.env.BACKEND_URL || "https://starteryou.com:3000";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://starteryou.com:8080";
const isProduction = process.env.NODE_ENV;
// Initialize Express app
const app = express();

// Middleware
dotenv.config();
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// **Request logging middleware for all incoming requests**
app.use((req, res, next) => {
  logger.info(`Incoming Request: ${req.method} ${req.url} from ${req.ip}`);
  next();
});

app.set("trust proxy", 1); // Trust proxy headers

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
        secure: isProduction, // Set to true if using HTTPS and set to false if using local environment
        sameSite: "Lax",
        maxAge: 60 * 60 * 1000, // 1 hour session duration
      },
    })
  );

// MongoDB connection and metadata storage
(async () => {
  try {
    await connectToMongoDB();
    logger.info("✅ MongoDB connected successfully");
    await storeMetadataInDB(); // Call metadata function after DB connection
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
    servers: [{ url: `${BACKEND_URL}/api` }],
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
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-test", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/system", verificationRoutes);
mountRoutes(app);

// Routes
app.use("/api/newsletter", newsletterRoutes);
app.use("/api", sessionRoutes);
app.use("/api", textRoutes);
app.use("/api/files", fileRoutes);
app.use("/api", teamRoutes);
app.use("/api/v1/auth", authRoutes);
app.use(router);

// Health Check Route
app.get("/health", (req, res) =>
  res.status(200).json({ message: "Server is running!" })
);

// Check MongoDB connection status
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
  res
    .status(err.status || 500)
    .json({
      error: "Internal Server Error",
      message: err.message || "Something went wrong",
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Server running at ${BACKEND_URL}:${PORT}`);
  logger.info(`📖 Swagger Docs available at ${BACKEND_URL}:${PORT}/api-test`);
  logger.info(`💻 Health Check: ${BACKEND_URL}:${PORT}/health`);
  logger.info(`🗄️ Database Status: ${BACKEND_URL}:${PORT}/db-status`);
  logger.info(`📚 API Documentation: ${BACKEND_URL}:${PORT}/api/docs`);
  logger.info(`📋 Postman Collection: ${BACKEND_URL}:${PORT}/api/docs/postman`);
  logger.info(
    `⚙️ File Verification: ${BACKEND_URL}:${PORT}/api/system/verify-all`
  );
});