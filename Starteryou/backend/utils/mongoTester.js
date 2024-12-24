// backend/utils/mongoTester.js
const mongoose = require("mongoose");

class MongoTester {
  constructor(uri) {
    this.uri = uri || process.env.MONGODB_URI;
    this.isConnected = false;
  }

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
