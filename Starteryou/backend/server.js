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

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

// Initialize Express app
const app = express();

// Middleware
dotenv.config();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure session store
const sessionStore = MongoStore.create({ mongoUrl: mongoUri });

sessionStore.on("connected", async () => {
  try {
    console.log("🗑️ Clearing session store...");
    await sessionStore.clear();
    console.log("✅ Session store cleared successfully.");
  } catch (err) {
    console.error("❌ Error clearing session store:", err);
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
      secure: false,
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000, // 1-hour session duration
    },
  })
);

// MongoDB connection and metadata storage
(async () => {
  try {
    await connectToMongoDB(); // Connect to MongoDB
    console.log("✅ MongoDB connected successfully");

    await storeMetadataInDB(); // Call metadata function after DB connection
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
})();

// Static file serving
app.use("/docs", express.static(path.join(__dirname, "docs"), { maxAge: "1y", immutable: true }));
console.log("📂 Serving static files from:", path.join(__dirname, "docs"));

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "API Documentation", version: "1.0.0", description: "API documentation for testing purposes" },
    servers: [{ url: `${BACKEND_URL}/api` }],
    tags: [
      { name: "TextRoutes", description: "Routes for text operations" },
      { name: "FileRoutes", description: "Routes for file operations" },
      { name: "Authentication", description: "Routes for Authentication endpoints" },
      { name: "Newsletter", description: "Routes for newsletter subscriptions" }
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
app.get("/health", (req, res) => res.status(200).json({ message: "Server is running!" }));

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
  console.error("🚨 Error:", err.message);
  res.status(err.status || 500).json({ error: "Internal Server Error", message: err.message || "Something went wrong" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at ${BACKEND_URL}:${PORT}`);
  console.log(`📖 Swagger Docs available at ${BACKEND_URL}:${PORT}/api-test`);
  console.log(`💻 Health Check: ${BACKEND_URL}:${PORT}/health`);
  console.log(`🗄️ Database Status: ${BACKEND_URL}:${PORT}/db-status`);
  console.log(`📚 API Documentation: ${BACKEND_URL}:${PORT}/api/docs`);
  console.log(`📋 Postman Collection: ${BACKEND_URL}:${PORT}/api/docs/postman`);
  console.log(`⚙️ File Verification: ${BACKEND_URL}:${PORT}/api/system/verify-all`);
});
