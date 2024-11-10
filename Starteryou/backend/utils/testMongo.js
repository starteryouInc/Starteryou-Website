/**
 * Test MongoDB connection using the MongoTester class.
 * 
 * This script connects to a MongoDB database using a URI and tests the connection,
 * including performing basic database operations (write, read, cleanup).
 * 
 * @module testMongo
 */

const MongoTester = require("./mongoTester");

/**
 * Run MongoDB connection test using the MongoTester class.
 * 
 * This function initializes a new MongoTester instance with a provided MongoDB URI,
 * and then calls the `testConnection` method to test the connection, perform basic
 * database operations, and print relevant information about the connection and health.
 * 
 * @async
 * @returns {Promise<void>} Resolves when the test completes successfully.
 * @throws {Error} Throws error if any part of the connection test fails.
 */
async function runTest() {
  // Replace with your MongoDB URI
  const uri =
    "mongodb://starteryouadmin:StarteryouAdmin2024@localhost:27017/?authSource=admin";

  const tester = new MongoTester(uri);
  await tester.testConnection();
}

// Run the test and catch any errors that occur
runTest().catch(console.error);
