const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables
const MongoTester = require("./utils/mongoTester");
const seedDatabase = require("./seedDatabase"); // Import seeding logic

let mongoConnection; // Reusable connection instance
let retryCount = 0;
const maxRetries = 5;

// Load MongoDB configuration from environment variables
const mongoUser = encodeURIComponent(process.env.MONGO_USER);
const mongoPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT || 27017;
const mongoDb = process.env.MONGO_DB || "starteryou";
const mongoAuthSource = process.env.MONGO_AUTH_SOURCE || "admin";
const mongoTls = process.env.MONGO_TLS === "true";
const mongoTlsCert = process.env.MONGO_TLS_CERT;
const mongoTlsCa = process.env.MONGO_TLS_CA;
const mongoAppName = process.env.MONGO_APP_NAME || "starteryouApp";

console.log("Loaded Environment Variables:", {
  mongoUser: process.env.MONGO_USER,
  mongoHost: process.env.MONGO_HOST,
  mongoPort: process.env.MONGO_PORT,
  mongoDb: process.env.MONGO_DB,
  mongoAuthSource: process.env.MONGO_AUTH_SOURCE,
  
});

// Debugging line to ensure the environment variables are loaded

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

// Enable mongoose debugging conditionally (e.g., for development)
if (process.env.NODE_ENV === "development") {
  mongoose.set("debug", true);
}

// Disable strict query filtering
mongoose.set("strictQuery", false);

// Test MongoDB connection
const testConnection = async () => {
  const tester = new MongoTester(mongoUri);
  try {
    await tester.testConnection();
    console.log("✅ MongoDB connection test successful!");
  } catch (error) {
    console.error("❌ MongoDB connection test failed:", error.message);
  }
};

// Function to connect to MongoDB and reuse connection
const connectToMongoDB = async () => {
  if (mongoConnection) {
    return mongoConnection;
  }

  while (retryCount < maxRetries) {
    try {
      console.log(
        `🔍 Attempting to connect to MongoDB... (Retry ${
          retryCount + 1
        }/${maxRetries})`
      );

      mongoConnection = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 60000,
        socketTimeoutMS: 60000,
        family: 4, // IPv4
      });

      console.log("✅ MongoDB connection established!");
      monitorConnectionEvents();

      // Seed the database after successful connection
      console.log("🌱 Seeding database...");
      await seedDatabase();
      console.log("✅ Database seeded successfully!");

      return mongoConnection;
    } catch (error) {
      retryCount++;
      console.error("❌ MongoDB Connection Error:", error.message);
      if (retryCount >= maxRetries) {
        console.error("❌ Max retries reached. Exiting...");
        process.exit(1);
      }
      console.log(`Retrying connection in 5 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

// Monitor MongoDB connection events
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

// Reusable Cache Query Function
const cacheQuery = async (key, queryFn, ttl = 3600) => {
  const Cache = require("./cache/models/cache"); // Dynamically load the Cache model
  const cachedEntry = await Cache.findOne({ key });

  if (cachedEntry && new Date() < cachedEntry.expiresAt) {
    console.log(`✅ Cache hit for key: ${key}`);
    return cachedEntry.value;
  }

  console.log(`❌ Cache miss for key: ${key}`);
  const result = await queryFn();
  const expiresAt = new Date(Date.now() + ttl * 1000);

  await Cache.findOneAndUpdate(
    { key },
    { value: result, expiresAt },
    { upsert: true, new: true }
  );

  return result;
};

// Export shared connection and utilities
module.exports = {
  connectToMongoDB,
  mongoose,
  cacheQuery,
};

// Run the connection test on startup
connectToMongoDB().catch(console.error);
