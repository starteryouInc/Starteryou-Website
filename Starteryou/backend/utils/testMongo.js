// testMongo.js
const MongoTester = require("./mongoTester");

async function runTest() {
  // Replace with your MongoDB URI
  const uri =
    "mongodb://starteryouadmin:StarteryouAdmin2024@localhost:27017/?authSource=admin";

  const tester = new MongoTester(uri);
  await tester.testConnection();
}

runTest().catch(console.error);
