// testMongo.js
const MongoTester = require("./mongoTester");
const logger = require("./logger"); // Logger import
require("dotenv").config();

logger.info("Loaded Environment Variables:", {
  mongoUser: process.env.MONGO_USER,
  mongoPassword: process.env.MONGO_PASSWORD,
  mongoHost: process.env.MONGO_HOST,
  mongoPort: process.env.MONGO_PORT,
  mongoDb: process.env.MONGO_DB,
  mongoAuthSource: process.env.MONGO_AUTH_SOURCE,
}); // Debugging line to ensure the environment variables are loaded
// Get the environment variables
const mongoUser = encodeURIComponent(process.env.MONGO_USER);
const mongoPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT || 27017; // Default to 27017 if not provided
const mongoDb = process.env.MONGO_DB;
const mongoAuthSource = process.env.MONGO_AUTH_SOURCE || "admin"; // Default to "admin" if not provided
const mongoTls = process.env.MONGO_TLS === "true"; // Convert to boolean
const mongoTlsCert = process.env.MONGO_TLS_CERT;
const mongoTlsCa = process.env.MONGO_TLS_CA;

// Check if necessary environment variables are set
if (!mongoUser || !mongoPassword || !mongoHost || !mongoDb) {
  logger.error("Missing necessary environment variables.");
  process.exit(1); // Exit the process if crucial variables are missing
}

async function runTest() {
  // Build the MongoDB URI conditionally based on whether TLS is enabled

  let mongoUri = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDb}?authSource=${mongoAuthSource}&directConnection=true&serverSelectionTimeoutMS=2000`;

  if (mongoTls) {
    if (!mongoTlsCert || !mongoTlsCa) {
      logger.error("Missing TLS certificate or CA file paths.");
      process.exit(1);
    }
    mongoUri += `&tls=true&tlsCertificateKeyFile=${mongoTlsCert}&tlsCAFile=${mongoTlsCa}`;
  }

  // Create an instance of MongoTester with the constructed URI
  const tester = new MongoTester(mongoUri);

  try {
    // Test the connection
    await tester.testConnection();
    logger.info("MongoDB connection test successful!");
  } catch (error) {
    logger.error("MongoDB connection test failed:", error);
  }
}

runTest().catch(logger.error);
