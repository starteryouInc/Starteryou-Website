/**
 * MongoTester class to test MongoDB connection, database operations, and network connectivity.
 * 
 * This utility class helps in verifying MongoDB connection and performing basic operations like
 * write, read, and cleanup. It also provides network connectivity tests to ensure that the 
 * MongoDB server is reachable from the application.
 * 
 * @module MongoTester
 */

const mongoose = require("mongoose");

/**
 * MongoTester class to handle MongoDB connection testing, basic database operations, 
 * and network connectivity checks.
 * 
 * @class
 */
class MongoTester {
  /**
   * Creates an instance of MongoTester.
   * 
   * @param {string} uri - MongoDB URI to connect to the database. Defaults to `process.env.MONGODB_URI`.
   */
  constructor(uri) {
    this.uri = uri || process.env.MONGODB_URI;
    this.isConnected = false;
  }

  /**
   * Tests the connection to the MongoDB server by attempting to connect and performing basic operations.
   * 
   * @async
   * @returns {Promise<Object>} A promise that resolves to the connection status and details.
   * @throws {Error} Throws error if the connection fails.
   */
  async testConnection() {
    console.log("\n🔍 Testing MongoDB Connection...");
    console.log("URI:", this.uri);

    try {
      const conn = await mongoose.connect(this.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });

      this.isConnected = true;

      // Connection info
      console.log("\n✅ Connection Successful!");
      console.log("MongoDB Version:", conn.connection.version);
      console.log("Database:", conn.connection.name);
      console.log("Host:", conn.connection.host);
      console.log("Port:", conn.connection.port);

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
      console.error("\n❌ Connection Failed!");
      console.error("Error:", error.message);

      this.printTroubleshootingGuide(error);

      return {
        success: false,
        error: error.message,
      };
    } finally {
      if (this.isConnected) {
        await mongoose.connection.close();
        console.log("\nConnection closed");
      }
    }
  }

  /**
   * Tests basic database operations: write, read, and cleanup.
   * 
   * @async
   * @returns {Promise<void>} Resolves when the operations are successful.
   * @throws {Error} Throws error if any of the operations fail.
   */
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
      await TestModel.create({ test: "connection_test", timestamp: new Date() });
      console.log("✅ Write operation successful");

      // Test read
      await TestModel.findOne({ test: "connection_test" });
      console.log("✅ Read operation successful");

      // Cleanup
      await mongoose.connection.dropCollection("testconnections");
      console.log("✅ Cleanup successful");
    } catch (error) {
      console.error("❌ Database operation failed:", error.message);
      throw error;
    }
  }

  /**
   * Tests network connectivity by attempting to connect to the specified MongoDB host and port.
   * 
   * @async
   * @returns {Promise<Object>} A promise that resolves with the network connectivity status.
   * @throws {Error} Throws error if the URI format is invalid.
   */
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

  /**
   * Prints troubleshooting guide based on the error encountered during MongoDB connection.
   * 
   * @param {Object} error - The error object returned by the failed connection attempt.
   * @returns {void}
   */
  printTroubleshootingGuide(error) {
    console.log("\n🔧 Troubleshooting Guide:");

    if (error.name === "MongoServerSelectionError") {
      console.log("1. Check if MongoDB server is running");
      console.log("2. Verify the connection string is correct");
      console.log("3. Ensure network connectivity to the database");
      console.log("4. Check if any firewalls are blocking the connection");
    } else if (error.name === "MongoParseError") {
      console.log("1. Check the connection string format");
      console.log("2. Verify credentials are properly encoded");
      console.log("3. Ensure all required connection parameters are present");
    } else if (error.name === "MongooseError") {
      console.log("1. Check if the database name is correct");
      console.log("2. Verify authentication credentials");
      console.log("3. Ensure proper access permissions");
    }
  }
}

module.exports = MongoTester;
