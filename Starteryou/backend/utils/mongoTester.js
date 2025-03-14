// backend/utils/mongoTester.js
const mongoose = require("mongoose");
const logger = require("./logger"); // Logger import

class MongoTester {
  constructor(uri) {
    this.uri = uri || process.env.MONGODB_URI;
    this.isConnected = false;
  }

  async testConnection() {
    logger.info("\n🔍 Testing MongoDB Connection...");
    logger.info("URI:", this.uri);

    try {
      const conn = await mongoose.connect(this.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });

      this.isConnected = true;

      // Connection info
      logger.info("\n✅ Connection Successful!");
      logger.info("MongoDB Version:", conn.connection.version);
      logger.info("Database:", conn.connection.name);
      logger.info("Host:", conn.connection.host);
      logger.info("Port:", conn.connection.port);

      // Test basic operations
      await this.testDatabaseOperations();

      return {
        success: true,
        details: {
          version: conn.connection.version,
          database: conn.connection.name,
          host: conn.connection.host,
          port: conn.connection.port,
        },
      };
    } catch (error) {
      logger.error("\n❌ Connection Failed!");
      logger.error("Error:", error.message);

      this.printTroubleshootingGuide(error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  async testDatabaseOperations() {
    try {
      // Create temporary collection
      const TestModel = mongoose.model(
        "TestConnection",
        new mongoose.Schema({
          test: String,
          timestamp: Date,
        })
      );

      // Test write
      await TestModel.create({
        test: "connection_test",
        timestamp: new Date(),
      });
      logger.info("✅ Write operation successful");

      // Test read
      await TestModel.findOne({ test: "connection_test" });
      logger.info("✅ Read operation successful");

      // Cleanup
      await mongoose.connection.dropCollection("testconnections");
      logger.info("✅ Cleanup successful");
    } catch (error) {
      logger.error("❌ Database operation failed:", error.message);
      throw error;
    }
  }

  async testNetworkConnectivity() {
    try {
      const url = new URL(this.uri);
      const host = url.hostname;
      const port = url.port || "27017";

      return new Promise((resolve) => {
        const net = require("net");
        const socket = new net.Socket();

        socket.setTimeout(5000);

        socket.on("connect", () => {
          socket.destroy();
          resolve({
            success: true,
            message: `Port ${port} is reachable on ${host}`,
          });
        });

        socket.on("timeout", () => {
          socket.destroy();
          resolve({
            success: false,
            message: `Connection to ${host}:${port} timed out`,
          });
        });

        socket.on("error", (error) => {
          resolve({
            success: false,
            message: error.message,
          });
        });

        socket.connect(port, host);
      });
    } catch (error) {
      return {
        success: false,
        message: `Invalid URI format: ${error.message}`,
      };
    }
  }

  printTroubleshootingGuide(error) {
    logger.info("\n🔧 Troubleshooting Guide:");

    if (error.name === "MongoServerSelectionError") {
      logger.info("1. Check if MongoDB server is running");
      logger.info("2. Verify the connection string is correct");
      logger.info("3. Ensure network connectivity to the database");
      logger.info("4. Check if any firewalls are blocking the connection");
    } else if (error.name === "MongoParseError") {
      logger.info("1. Check the connection string format");
      logger.info("2. Verify credentials are properly encoded");
      logger.info("3. Ensure all required connection parameters are present");
    } else if (error.name === "MongooseError") {
      logger.info("1. Check if the database name is correct");
      logger.info("2. Verify authentication credentials");
      logger.info("3. Ensure proper access permissions");
    }
  }
}

module.exports = MongoTester;
