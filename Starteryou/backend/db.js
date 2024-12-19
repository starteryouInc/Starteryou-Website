const MongoTester = require("./utils/mongoTester");
const seedDatabase = require("./seedDatabase"); // Import seeding logic

const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

let retryCount = 0;
const maxRetries = 5;

// Load environment variables
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_AUTH_SOURCE,
  MONGO_TLS,
  MONGO_TLS_CERT,
  MONGO_TLS_CA,
  MONGO_APP_NAME,
} = process.env;

// Construct the MongoDB URI dynamically
let mongoUri = `mongodb://${encodeURIComponent(
  MONGO_USER
)}:${encodeURIComponent(
  MONGO_PASSWORD
)}@${MONGO_HOST}:${MONGO_PORT}/?authSource=${MONGO_AUTH_SOURCE}`;
if (MONGO_TLS === "true") {
  mongoUri += `&tls=true&tlsCertificateKeyFile=${MONGO_TLS_CERT}&tlsCAFile=${MONGO_TLS_CA}`;
}
mongoUri += `&appName=${MONGO_APP_NAME || "ExpressApp"}`;

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
    console.log("MongoDB connection test successful!");
  } catch (error) {
    console.error("MongoDB connection test failed:", error);
  }
}

// Function to connect to MongoDB
const connectToMongoDB = async () => {
  while (retryCount < maxRetries) {
    try {
      console.log(
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

      // Monitor connection events only after a successful connection
      monitorConnectionEvents();

      // Seed the database after successful connection
      await seedDatabase();

      return; // Exit loop on success
    } catch (error) {
      retryCount++;
      console.error("❌ MongoDB Connection Error:", error.message);
      if (retryCount >= maxRetries) {
        console.error("❌ Max retries reached. Exiting...");
        process.exit(1);
      }
      console.log(
        `Retrying connection (${retryCount}/${maxRetries}) in 5 seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

// Function to monitor MongoDB connection events
const monitorConnectionEvents = () => {
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB Connected Successfully!");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("❌ MongoDB Disconnected.");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Error:", err.message);
  });
};

// Run the connection test
runTest().catch(console.error);
console.log("MongoDB URI:", mongoUri);

module.exports = { connectToMongoDB };
