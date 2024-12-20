const MongoTester = require("./utils/mongoTester");
const seedDatabase = require("./seedDatabase");
const mongoose = require("mongoose");

let retryCount = 0;
const maxRetries = 5;

// Hardcoded MongoDB URI
const mongoUri =
  "mongodb://starteryouadmin:4mXq!9%40lPZ7gT8$h@52.207.194.195:27017/?authSource=admin&tls=true&tlsCertificateKeyFile=/certificates/server.pem&tlsCAFile=/certificates/ca.crt";

mongoose.set("strictQuery", false);
mongoose.set("debug", true);

// Test MongoDB connection
async function runTest() {
  const tester = new MongoTester(mongoUri);
  try {
    await tester.testConnection();
    console.log("✅ MongoDB connection test successful!");
  } catch (error) {
    console.error("❌ MongoDB connection test failed:", error);
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
        connectTimeoutMS: 120000, // 2 minutes
        socketTimeoutMS: 120000, // 2 minutes
        serverSelectionTimeoutMS: 120000, // 2 minutes
        family: 4, // IPv4
      });

      // Wait for the connection to be fully ready
      await mongoose.connection.asPromise();

      console.log("✅ MongoDB connection established!");

      // Monitor connection events only after a successful connection
      monitorConnectionEvents();

      // Validate the connection before running operations
      const isConnected = mongoose.connection.readyState === 1;
      if (isConnected) {
        console.log("🔍 Connection state validated: Ready for operations.");
      } else {
        console.warn("⚠️ Connection state not ready. Retrying...");
        throw new Error("Connection state not ready");
      }

      // Seed the database after successful connection
      console.log("🌱 Seeding database...");
      await seedDatabase();
      console.log("✅ Database seeded successfully!");

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
    console.error("❌ MongoDB connection lost. Retrying...");
  });

  process.on("SIGINT", async () => {
    console.log("🔌 Shutting down gracefully...");
    await mongoose.disconnect();
    process.exit(0);
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Error:", err.message);
  });
};

// Run the connection test
runTest().catch(console.error);
console.log("MongoDB URI:", mongoUri);

module.exports = { connectToMongoDB, mongoConnection: mongoose.connection };
