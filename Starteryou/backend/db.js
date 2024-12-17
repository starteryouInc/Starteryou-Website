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
        connectTimeoutMS: 30000,
        family: 4, // Force IPv4
      });

      console.log("✅ MongoDB Connected Successfully!");

      // Seed the database after successful connection
      await seedDatabase();

      // Monitor connection events
      monitorConnectionEvents();

      return mongoose.connection; // Return the connection object
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
    console.log("✅ MongoDB connection established.");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("❌ MongoDB Disconnected. Retrying...");
    connectToMongoDB();
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Error:", err.message);
  });
};

// Export the connection logic and connection object
module.exports = { connectToMongoDB, mongoConnection: mongoose.connection };
