const MongoTester = require("./utils/mongoTester");
const seedDatabase = require("./seedDatabase"); // Import seeding logic
const logger = require("./utils/logger"); // Logger import

const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

let retryCount = 0;
const maxRetries = 5;

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

logger.info("Loaded Environment Variables:", {
  mongoUser: process.env.MONGO_USER,
  mongoPassword: process.env.MONGO_PASSWORD,
  mongoHost: process.env.MONGO_HOST,
  mongoPort: process.env.MONGO_PORT,
  mongoDb: process.env.MONGO_DB,
  mongoAuthSource: process.env.MONGO_AUTH_SOURCE,
});

// Debugging line to ensure the environment variables are loaded

// Check for missing required environment variables
if (!mongoUser || !mongoPassword || !mongoHost || !mongoDb) {
  logger.error("❌ Missing required MongoDB environment variables");
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

// Enable mongoose debugging conditionally (e.g., for development)
if (process.env.NODE_ENV === "development") {
  mongoose.set("debug", true);
}

mongoose.set("strictQuery", false);

// Test MongoDB connection
async function runTest() {
  const tester = new MongoTester(mongoUri);
  try {
    await tester.testConnection();
    logger.info("✅ MongoDB connection test successful!");
  } catch (error) {
    logger.error("❌ MongoDB connection test failed:", error);
  }
}

// Function to connect to MongoDB
const connectToMongoDB = async () => {
  while (retryCount < maxRetries) {
    try {
      logger.info(
        `🔍 Attempting to connect to MongoDB... (Retry ${
          retryCount + 1
        }/${maxRetries})`
      );

      await mongoose.connect(mongoUri, {
        connectTimeoutMS: 60000,
        socketTimeoutMS: 60000,
        family: 4, // IPv4
      });

      // Wait for the connection to be fully ready
      await mongoose.connection.asPromise();

      logger.info("✅ MongoDB connection established!");

      // Monitor connection events only after a successful connection
      monitorConnectionEvents();

      // Validate the connection before running operations
      const isConnected = mongoose.connection.readyState === 1;
      if (isConnected) {
        logger.info("🔍 Connection state validated: Ready for operations.");
      } else {
        console.warn("⚠️ Connection state not ready. Retrying...");
        throw new Error("Connection state not ready");
      }

      // Seed the database after successful connection
      logger.info("🌱 Seeding database...");
      await seedDatabase();
      logger.info("✅ Database seeded successfully!");

      return; // Exit loop on success
    } catch (error) {
      retryCount++;
      logger.error("❌ MongoDB Connection Error:", error.message);
      if (retryCount >= maxRetries) {
        logger.error("❌ Max retries reached. Exiting...");
        process.exit(1);
      }
      logger.info(
        `Retrying connection (${retryCount}/${maxRetries}) in 5 seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

// Function to monitor MongoDB connection events
const monitorConnectionEvents = () => {
  mongoose.connection.on("connected", () => {
    logger.info("✅ MongoDB Connected Successfully!");
  });

  mongoose.connection.on("disconnected", () => {
    logger.info("❌ MongoDB Disconnected.");
  });

  mongoose.connection.on("error", (err) => {
    logger.error("❌ MongoDB Error:", err.message);
  });
};

// Run the connection test
runTest().catch(logger.error);
logger.info("MongoDB URI:", mongoUri);

module.exports = {
  connectToMongoDB,
  mongoUri,
  mongoConnection: mongoose.connection,
};
